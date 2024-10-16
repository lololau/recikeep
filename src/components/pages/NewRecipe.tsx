"use client";

import { useRouter } from "next/navigation";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { IoIosAddCircle, IoMdCloseCircle } from "react-icons/io";
import { api } from "recikeep/trpc/react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { BiLoaderAlt } from "react-icons/bi";
import { UploadButton } from "recikeep/utils/uploadthing";
import { compressFile } from "recikeep/app/api/uploadthing/core";

export interface IFormRecipe {
	title: string;
	description: string | null;
	source: string;
	sourceLink: string | null;
	portions: number;
	glucides: string | null;
	ingredients: { name: string; quantity: string }[];
	tags?: { name: string }[];
}

type NewRecipeFormProps = {
	bucketId: string;
	recipeTitle: string;
	source: string;
	sourceLink: string | null;
};

type UpdateRecipeFormProps = {
	recipeId: string;
	preparation: string | null;
	mainImage: string | null;
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
			sourceLink:
				initialData?.sourceLink ?? updateInitialData?.sourceLink ?? null,
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

	const { mutateAsync: deleteImageRecipe } =
		api.recipes.deleteImageRecipeByKey.useMutation({
			onSuccess() {
				setImageUrl(null);
				toast.success("Image supprimée.");
			},
			onError(error) {
				toast.error(error.data?.code);
			},
		});

	const { mutateAsync: createRecipe, isPending: loadingCreateRecipe } =
		api.recipes.createRecipe.useMutation({
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

	const { mutateAsync: updateRecipe, isPending: loadingUpdateRecipe } =
		api.recipes.updateRecipe.useMutation({
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
	const [imageUrl, setImageUrl] = useState<string | null>(
		recipeDetails?.mainImage ?? null,
	);

	const onSubmit: SubmitHandler<IFormRecipe> = async (data) => {
		const tags = data.tags?.map((el) => el.name);

		const valuesToReturn = {
			...data,
			tags,
			preparation,
			imageUrl,
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
		setValue(
			"sourceLink",
			initialData?.sourceLink ?? updateInitialData?.sourceLink ?? null,
		);
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
					{/* === Source link === */}
					<div className="grid gap-1 py-2">
						<label
							htmlFor="sourceLink"
							className="text-base font-light text-emerald-800"
						>
							Lien de ta source
						</label>
						<div className="rounded-md shadow-sm border-2 sm:max-w-md">
							<input
								id="sourceLink"
								aria-invalid={errors.sourceLink ? "true" : "false"}
								className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
								placeholder="https://www.recipe-website.fr"
								{...register("sourceLink", { required: true })}
							/>
							<p>{errors.sourceLink?.message}</p>
						</div>
					</div>
					{/* Photo principal */}
					<div>
						<label
							htmlFor="personal_picture"
							className="text-base font-light text-emerald-800"
						>
							Photo principale
						</label>
						<div className="flex flex-col items-start justify-between p-2">
							<UploadButton
								className="justify-start ut-button:bg-emerald-800 ut-label:text-sm"
								endpoint="imageUploader"
								content={{
									button({ ready }) {
										if (ready) return <div>Choisis une photo</div>;
										return "Chargement...";
									},
									allowedContent({ ready, fileTypes, isUploading }) {
										if (!ready) return "...";
										if (isUploading) return "En téléchargement";
										return `Type: ${fileTypes.join(", ")}`;
									},
								}}
								onBeforeUploadBegin={async (files) => {
									// Compress file before uploading
									const compressedFiles: File[] = [];

									for (let i = 0; i < files.length; i++) {
										const image = files[i];
										const imageCompressed = await compressFile(image);
										compressedFiles.push(imageCompressed);
									}
									return compressedFiles;
								}}
								onClientUploadComplete={(res) => {
									if (imageUrl) {
										deleteImageRecipe(imageUrl);
									}
									toast.success("Image ajoutée!");
									setImageUrl(res[0].key);
								}}
								onUploadError={(error: Error) => {
									toast.error(`Erreur! ${error.message}`);
								}}
							/>
							{imageUrl?.length ? (
								<div className="flex flex-row gap-2">
									<img
										src={`https://utfs.io/f/${imageUrl}`}
										alt=""
										className="w-40 h-auto"
									/>
									<button
										type="button"
										className="font-base text-emerald-800 text-xl"
										onClick={() => {
											deleteImageRecipe(imageUrl);
										}}
									>
										<IoMdCloseCircle />
									</button>
								</div>
							) : null}
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
					{(loadingCreateRecipe || loadingUpdateRecipe) && (
						<BiLoaderAlt className="animate-spin disabled" color="#065f46" />
					)}
					{!loadingCreateRecipe && !loadingUpdateRecipe && (
						<IoIosCheckmarkCircle color="#065f46" />
					)}
				</button>
			</div>
		</form>
	);
}
