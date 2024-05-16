"use client";

import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { api } from "recikeep/trpc/react";
import { toast } from "sonner";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import "react-quill/dist/quill.snow.css";

import { Button } from "recikeep/components/Button";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import QuillEditorComponent from "../QuillEditor";

interface IFormRecipe {
	title: string;
	description?: string;
	source: string;
	portions: number;
	glucides?: string;
	ingredients: { name: string; quantity: string }[];
	tags?: { name: string }[];
}

export default function NewRecipeForm() {
	const router = useRouter();

	const {
		register,
		control,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<IFormRecipe>({
		defaultValues: {
			ingredients: [{ name: "", quantity: "" }],
			tags: [],
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

	const { mutateAsync, mutate, isPending, error } =
		api.recipes.createRecipe.useMutation({
			onSuccess(data, variables, context) {
				// TODO: toast success do not work
				toast.success("Recette créée.");
				router.push(`/recipe/${data.id}`);
			},
			onError(error) {
				// TODO: get error message
				toast.error(error.data?.code);
			},
		});

	const [preparation, setPreparation] = useState("");

	const onSubmit: SubmitHandler<IFormRecipe> = async (data) => {
		const tags = getValues("tags")?.map((el) => el.name);
		const portions = Number(getValues("portions"));

		const values = getValues();

		// Cast tags into string[]
		const valuesToReturn = { ...values, tags, portions, preparation };

		await mutateAsync(valuesToReturn);
	};

	// TODO; check read hook form, data typé selon le formulaire fait via react hook form
	// async function handleSubmit() {
	// await mutateAsync()
	// }

	// Cas suppr => use mutate au lieu de mutateAsync
	// function clickOnerror() {
	// 	mutate({ ingredients: })
	// }

	return (
		<MaxWidthWrapper>
			<div className="pb-10 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-pink-50">
					<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
						Nouvelle recette
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">Oh yeah.</p>
				</div>
			</div>
			<div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid grid-cols-2 mb-2 gap-2">
						<div className="grid gap-2">
							{/* === Title === */}
							<div className="grid gap-1 py-2">
								<label htmlFor="title" className="text-base font-semibold">
									Titre
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
							{/* === Title === */}
							<div className="grid gap-1 py-2">
								<label htmlFor="source" className="text-base font-semibold">
									Source
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
									className="text-base font-semibold"
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
								<label htmlFor="portions" className="text-base font-semibold">
									Nombre de portions
								</label>
								<div className="rounded-md shadow-sm border-2 sm:max-w-md">
									<input
										id="portions"
										className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
										placeholder="2"
										{...register("portions", { required: true })}
									/>
									<p>{errors.portions?.message}</p>
								</div>
							</div>

							{/* === Glucides === */}
							<div className="grid gap-1 py-2">
								<label htmlFor="glucides" className="text-base font-semibold">
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
						<div className="grid gap-2">
							{/* === Ingrédients === */}
							<div className="gap-1 py-2 whitespace-nowrap min-w-full">
								<div className="flex flex-row gap-6">
									<p className="font-semibold">Ingrédients</p>
									<div className="text-center">
										<button
											type="button"
											onClick={() =>
												appendIngredient({ name: "", quantity: "" })
											}
										>
											<IoIosAddCircle color="emerald" size="25px" />
										</button>
									</div>
								</div>
								<p>{errors.ingredients?.message}</p>
								<div className="items-center gap-2">
									<ul>
										{fieldsIngredients.map((item, index) => {
											return (
												<li key={item.id} className="grid grid-cols-5 gap-2">
													<div className="rounded-md shadow-sm border-2 sm:max-w-md col-span-2 px-1">
														<input
															{...register(`ingredients.${index}.name`, {
																required: true,
															})}
															placeholder="Quel ingrédient ?"
															className="w-full text-sm py-1.5 pl-1"
														/>
													</div>

													<div className="rounded-md shadow-sm border-2 sm:max-w-md col-span-2 px-1">
														<input
															placeholder="Quelle quantité ?"
															{...register(`ingredients.${index}.quantity`, {
																required: true,
															})}
															className="w-full text-sm py-1.5 pl-1"
														/>
													</div>

													<div className="text-center self-center">
														<button
															onClick={() => {
																removeIngredient(index);
															}}
															type="button"
															className="items-center pt-1 gap-x-2 font-semibold text-emerald-600 hover:text-emerald-800 text-lg disabled:opacity-50 disabled:pointer-events-none"
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
									<p className="font-semibold pb-1">Tags</p>
									<button type="button" onClick={() => appendTag({ name: "" })}>
										<IoIosAddCircle color="emerald" size="25px" />
									</button>
								</div>
								<div className="flex flex-row items-center gap-2 py-2">
									<ul>
										{fieldsTag.map((item, index) => {
											return (
												<li key={item.id} className="grid grid-cols-5 gap-2">
													<div className="rounded-md shadow-sm border-2 sm:max-w-md col-span-2 px-1 flex flex-row py-1">
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
															className="items-center gap-x-2 font-semibold text-emerald-600 hover:text-emerald-800 text-lg disabled:opacity-50 disabled:pointer-events-none"
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
					<div className="grid gap-2 py-2">
						{/* === Preparation details === */}
						<label htmlFor="preparation" className="text-base font-semibold">
							Étapes de préparation
						</label>
						<QuillEditorComponent
							value={preparation}
							setValue={setPreparation}
						/>
					</div>
					<div className="text-center py-20">
						<Button text="Valider la recette" />
					</div>
				</form>
			</div>
		</MaxWidthWrapper>
	);
}
