"use client";

import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { api } from "recikeep/trpc/react";
import { toast } from "sonner";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";

import { Button } from "recikeep/components/Button";
import { IngredientsTable } from "recikeep/components/IngredientsTable";
import { Input } from "recikeep/components/Input";
import { InputLabel } from "recikeep/components/InputLabel";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

interface IFormRecipe {
	title: string;
	preparation?: string;
	portions: number;
	glucides?: string;
	ingredients?: { name: string; quantity: string }[];
	tags?: { name: string }[];
}

export default function NewRecipeForm() {
	// const router = useRouter();
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormRecipe>({
		defaultValues: {
			title: "",
			preparation: "",
			ingredients: [{ name: "", quantity: "" }],
			tags: [{ name: "" }],
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

	const onSubmit: SubmitHandler<IFormRecipe> = (data) =>
		console.log("recipe", data);

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
					<div className="grid grid-cols-2">
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

							{/* === Preparation details === */}
							<div className="grid gap-1 py-2">
								<label
									htmlFor="preparation"
									className="text-base font-semibold"
								>
									Préparation
								</label>
								<div className="rounded-md shadow-sm border-2 sm:max-w-md">
									<textarea
										id="preparation"
										className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
										placeholder="Décris les étapes de ta recette"
										{...register("preparation", { required: false })}
									/>
									<p>{errors.preparation?.message}</p>
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
							<div className="gap-1 py-2 whitespace-nowrap min-w-full">
								{/* === Ingrédients === */}
								<div className="flex flex-row gap-6">
									<p className="font-semibold">Ingrédients</p>
									<div className="text-center">
										<button
											type="button"
											onClick={() =>
												appendIngredient({ name: "", quantity: "" })
											}
										>
											<IoIosAddCircle color="green" size="25px" />
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
															className="w-full text-sm"
														/>
													</div>

													<div className="rounded-md shadow-sm border-2 sm:max-w-md col-span-2 px-1">
														<input
															placeholder="Quelle quantité ?"
															{...register(`ingredients.${index}.quantity`, {
																required: true,
															})}
															className="w-full text-sm"
														/>
													</div>

													<div className="text-center self-center">
														<button
															onClick={() => {
																removeIngredient(index);
															}}
															type="button"
															className="items-center pt-1 gap-x-2 font-semibold text-green-600 hover:text-green-800 text-lg disabled:opacity-50 disabled:pointer-events-none"
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
							<div className="gap-1 py-2">
								<div className="flex flex-row gap-6">
									<p className="font-semibold pb-1">Tags</p>
									<button type="button" onClick={() => appendTag({ name: "" })}>
										<IoIosAddCircle color="green" size="25px" />
									</button>
								</div>
								<div className="flex flex-row items-center gap-2 py-2">
									<ul>
										{fieldsTag.map((item, index) => {
											return (
												<li key={item.id} className="grid grid-cols-5 gap-2">
													<div className="rounded-md shadow-sm border-2 sm:max-w-md col-span-2 px-1 flex flex-row">
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
															className="items-center pt-1 gap-x-2 font-semibold text-green-600 hover:text-green-800 text-lg disabled:opacity-50 disabled:pointer-events-none"
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
					<div className="text-center py-20">
						<Button text="Valider la recette" />
					</div>
				</form>
			</div>
		</MaxWidthWrapper>
	);
}

// const { mutateAsync, mutate, isPending, error } =
// 	api.recipes.createRecipe.useMutation({
// 		onSuccess(data, variables, context) {
// 			router.push(`/recipe/${data.id}`);
// 			toast.success("Recette créée.");
// 		},
// 		onError(error) {
// 			toast.error(error.message);
// 		},
// 	});

// TODO; check read hook form, data typé selon le formulaire fait via react hook form
// async function handleSubmit() {
// await mutateAsync()
// }

// Cas suppr => use mutate au lieu de mutateAsync
// function clickOnerror() {
// 	mutate({ ingredients: })
// }
