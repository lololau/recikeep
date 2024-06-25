"use client";

import { useRouter } from "next/navigation";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { IoIosAddCircle } from "react-icons/io";
import "react-quill/dist/quill.snow.css";
import { api } from "recikeep/trpc/react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

export interface IFormRecipe {
	title: string;
	description: string | null;
	source: string;
	portions: number;
	glucides: string | null;
	ingredients: { name: string; quantity: string }[];
	tags?: { name: string }[];
}

type NewRecipeFormProps = {
	bucketId: string;
	recipeTitle: string;
	source: string;
};

type UpdateRecipeFormProps = {
	recipeId: string;
	preparation: string | null;
};

export default function NewRecipeForm({
	initialData,
	updateInitialData,
	recipeDetails,
}: {
	initialData?: NewRecipeFormProps;
	updateInitialData?: IFormRecipe;
	recipeDetails?: UpdateRecipeFormProps;
}) {
	const router = useRouter();

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<IFormRecipe>({
		defaultValues: {
			ingredients: updateInitialData?.ingredients ?? [
				{ name: "", quantity: "" },
			],
			tags: updateInitialData?.tags ?? [],
			title: initialData?.recipeTitle ?? updateInitialData?.title ?? "",
			source: initialData?.source ?? updateInitialData?.source ?? "",
			description: updateInitialData?.description ?? null,
			portions: updateInitialData?.portions,
			glucides: updateInitialData?.glucides ?? null,
		},
	});
	const {
		fields: fieldsTag,
		append: appendTag,
		remove: removeTag,
	} = useFieldArray({
		control,
		name: "tags",
	});

	const {
		fields: fieldsIngredients,
		append: appendIngredient,
		remove: removeIngredient,
	} = useFieldArray({
		control,
		name: "ingredients",
	});

	const utils = api.useUtils();

	const { mutateAsync: createRecipe } = api.recipes.createRecipe.useMutation({
		onSuccess(data) {
			toast.success("Recette créée.");
			router.push(`/recipe/${data.id}`);
			utils.recipes.getRecipesByUserId.invalidate();
			utils.buckets.getBucketsByUserId.invalidate();
		},
		onError(error) {
			toast.error(error.data?.code);
		},
	});

	const { mutateAsync: updateRecipe } = api.recipes.updateRecipe.useMutation({
		onSuccess(data) {
			toast.success("Recette modifiée.");
			router.push(`/recipe/${data.id}`);
			utils.recipes.getRecipesByUserId.invalidate();
			utils.recipes.getRecipeById.invalidate(data.id);
			utils.recipes.getIngredientsByRecipeId.invalidate(data.id);
			utils.recipes.getTagsByRecipeId.invalidate(data.id);
		},
		onError(error) {
			toast.error(error.data?.code);
		},
	});

	const [preparation, setPreparation] = useState(
		recipeDetails?.preparation ?? "",
	);

	const onSubmit: SubmitHandler<IFormRecipe> = async (data) => {
		const tags = data.tags?.map((el) => el.name);

		const valuesToReturn = {
			...data,
			tags,
			preparation,
			bucketId: initialData?.bucketId,
			recipeId: recipeDetails?.recipeId,
		};

		if (recipeDetails?.recipeId) {
			await updateRecipe(valuesToReturn);
		} else {
			await createRecipe(valuesToReturn);
		}
	};

	useEffect(() => {
		setValue(
			"title",
			initialData?.recipeTitle ?? updateInitialData?.title ?? "",
		);
		setValue("source", initialData?.source ?? updateInitialData?.source ?? "");
	}, [initialData, updateInitialData, setValue]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="grid  mb-2 gap-2 px-2.5 sm:px-0">
				<div className="grid gap-2">
					{/* === Title === */}
					<div className="gap-1 py-2">
						<label
							htmlFor="title"
							className="text-base font-light text-emerald-800"
						>
							Titre *
						</label>
						<div className="rounded-md shadow-sm border-2 sm:max-w-md">
							<input
								id="title"
								aria-invalid={errors.title ? "true" : "false"}
								className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
								placeholder="Ton titre"
								{...register("title", { required: true })}
							/>
							<p>{errors.title?.message}</p>
						</div>
					</div>
					{/* === Source === */}
					<div className="grid gap-1 py-2">
						<label
							htmlFor="source"
							className="text-base font-light text-emerald-800"
						>
							Source *
						</label>
						<div className="rounded-md shadow-sm border-2 sm:max-w-md">
							<input
								id="source"
								aria-invalid={errors.source ? "true" : "false"}
								className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
								placeholder="Ta source"
								{...register("source", { required: true })}
							/>
							<p>{errors.source?.message}</p>
						</div>
					</div>
					{/* === Description === */}
					<div className="grid gap-1 py-2">
						<label
							htmlFor="description"
							className="text-base font-light text-emerald-800"
						>
							Description
						</label>
						<div className="rounded-md shadow-sm border-2 sm:max-w-md">
							<input
								id="description"
								aria-invalid={errors.description ? "true" : "false"}
								className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
								placeholder="Courte description"
								{...register("description", { required: false })}
							/>
							<p>{errors.description?.message}</p>
						</div>
					</div>

					{/* === Portions quantity === */}
					<div className="grid gap-1 py-2">
						<label
							htmlFor="portions"
							className="text-base font-light text-emerald-800"
						>
							Nombre de portions *
						</label>
						<div className="rounded-md shadow-sm border-2 sm:max-w-md">
							<input
								id="portions"
								className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
								placeholder="2"
								{...register("portions", {
									required: true,
									valueAsNumber: true,
								})}
							/>
							<p>{errors.portions?.message}</p>
						</div>
					</div>

					{/* === Glucides === */}
					<div className="grid gap-1 py-2">
						<label
							htmlFor="glucides"
							className="text-base font-light text-emerald-800"
						>
							Total des glucides du plat
						</label>
						<div className="rounded-md shadow-sm border-2 sm:max-w-md">
							<input
								id="glucides"
								className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
								placeholder="30g"
								{...register("glucides", { required: false })}
							/>
							<p>{errors.glucides?.message}</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-start gap-2">
					{/* === Ingrédients === */}
					<div className="py-2 whitespace-nowrap min-w-full">
						<div className="flex flex-row gap-6">
							<p className="font-light text-emerald-800">Ingrédients *</p>
							<div>
								<button
									className="text-xl"
									type="button"
									onClick={() => appendIngredient({ name: "", quantity: "" })}
								>
									<IoIosAddCircle color="#065f46" />
								</button>
							</div>
						</div>
						<p>{errors.ingredients?.message}</p>
						<div className="items-center gap-2">
							<ul>
								{fieldsIngredients.map((item, index) => {
									return (
										<li key={item.id} className="flex flex-row gap-2">
											<div className="rounded-md shadow-sm border-2 sm:max-w-md px-1 flex-grow">
												<input
													{...register(`ingredients.${index}.name`, {
														required: true,
													})}
													placeholder="Quel ingrédient ?"
													className="w-full text-sm py-1.5 pl-1"
												/>
											</div>

											<div className="rounded-md shadow-sm border-2 sm:max-w-md px-1 flex-grow">
												<input
													placeholder="Quelle quantité ?"
													{...register(`ingredients.${index}.quantity`, {
														required: true,
													})}
													className="w-full text-sm py-1.5 pl-1"
												/>
											</div>

											<div className="text-center self-center flex-none">
												<button
													onClick={() => {
														removeIngredient(index);
													}}
													type="button"
													className="items-center pt-1 gap-x-2 font-light text-emerald-800 hover:text-emerald-600 text-lg disabled:opacity-50 disabled:pointer-events-none"
												>
													<MdDeleteOutline />
												</button>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>

					{/* === Tags === */}
					<div className="gap-1 py-2">
						<div className="flex flex-row gap-6">
							<p className="font-light gap-1 text-emerald-800">Tags</p>
							<button
								className="text-xl"
								type="button"
								onClick={() => appendTag({ name: "" })}
							>
								<IoIosAddCircle color="#065f46" />
							</button>
						</div>
						<div className="flex flex-row items-center gap-2 py-2">
							<ul>
								{fieldsTag.map((item, index) => {
									return (
										<li key={item.id} className="flex flex-row gap-2">
											<div className="rounded-md shadow-sm border-2 sm:max-w-md px-1 flex flex-row py-1">
												<input
													{...register(`tags.${index}.name`, {
														required: true,
													})}
													placeholder="Healthy ?"
													className="w-full text-sm"
												/>

												<button
													onClick={() => {
														removeTag(index);
													}}
													type="button"
													className="items-center gap-x-2 font-light text-emerald-800 hover:text-emerald-600 text-lg disabled:opacity-50 disabled:pointer-events-none"
												>
													<MdDeleteOutline />
												</button>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2 py-2 px-2.5 sm:px-0">
				{/* === Preparation details === */}
				<label
					htmlFor="preparation"
					className="text-base font-light text-emerald-800"
				>
					Étapes de préparation
				</label>
				<section>
					<textarea
						className="w-full p-2 rounded-md shadow-sm border-2 h-60"
						placeholder="Décris les étapes de ta recette 🍕"
						value={preparation}
						onChange={(e) => setPreparation(e.target.value)}
					/>
				</section>
			</div>
			<div className="text-center py-10 text-3xl">
				<button type="submit">
					<IoIosCheckmarkCircle color="#065f46" />
				</button>
			</div>
		</form>
	);
}
