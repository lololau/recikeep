"use client";

import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { api } from "recikeep/trpc/react";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";

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
	ingredients: { name: string; quantity: string }[];
	tags: string[];
}
interface IIngredient {
	name: string;
	quantity: string;
}

export default function NewRecipeForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<IFormRecipe>();

	const onSubmitRecipe: SubmitHandler<IFormRecipe> = (data) =>
		console.log("recipe", data);
	const { mutateAsync, mutate, isPending, error } =
		api.recipes.createRecipe.useMutation({
			onSuccess(data, variables, context) {
				router.push(`/recipe/${data.id}`);
				toast.success("Recette créée.");
			},
			onError(error) {
				toast.error(error.message);
			},
		});

	// TODO; check read hook form, data typé selon le formulaire fait via react hook form
	// async function handleSubmit() {
	// await mutateAsync()
	// }

	// Cas suppr => use mutate au lieu de mutateAsync
	// function clickOnerror() {
	// 	mutate({ ingredients: })
	// }

	const [tag, setTag] = useState("");
	const [tags, setTags] = useState([]);
	const [ingredient, setIngredient] = useState<IIngredient>({
		name: "",
		quantity: "",
	});
	const [ingredients, setIngredients] = useState([
		{ name: "Courgettes", quantity: "2" },
	]);

	const append = () => {
		setIngredients([
			...ingredients,
			{ name: ingredient.name, quantity: ingredient.quantity },
		]);
	};

	const remove = (index: number) => {
		setIngredients([
			...ingredients.slice(0, index),
			...ingredients.slice(index + 1),
		]);
	};

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
				<form onSubmit={handleSubmit(onSubmitRecipe)}>
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
								</div>
							</div>
						</div>
						<div className="grid gap-2">
							<div className="gap-1 py-2 whitespace-nowrap min-w-full">
								<p className="font-semibold pb-1">Ingrédients</p>
								<div className="flex flex-row items-center gap-2">
									<div className="rounded-md shadow-sm border-2 sm:max-w-md">
										<input
											value={ingredient.name}
											onChange={(e) =>
												setIngredient({ ...ingredient, name: e.target.value })
											}
											required={false}
											className={
												"border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
											}
											placeholder="Quel ingrédient ?"
										/>
									</div>
									<div className="rounded-md shadow-sm border-2 sm:max-w-md">
										<input
											value={ingredient.quantity}
											onChange={(e) =>
												setIngredient({
													...ingredient,
													quantity: e.target.value,
												})
											}
											required={false}
											className={
												"border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
											}
											placeholder="Quelle quantité ?"
										/>
									</div>
									<button type="button" className="text-end" onClick={append}>
										<IoIosAddCircle color="green" size="25px" />
									</button>
								</div>
								<div className="py-2">
									<div
										className="border border-slate-300 rounded-lg overflow-hidden"
										{...register("ingredients")}
									>
										<table className="min-w-full divide-y divide-gray-200">
											<tbody className="divide-y divide-gray-200">
												{ingredients.map((ingredient, index) => (
													<tr key={`${ingredient.name}_${index}`}>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
															{ingredient.name}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
															{ingredient.quantity}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-end font-medium">
															<button
																onClick={() => {
																	remove(index);
																}}
																type="button"
																className="inline-flex items-center gap-x-2 font-semibold rounded-lg border border-transparent text-green-600 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none"
															>
																<MdDeleteOutline />
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div className="gap-1 py-2">
								<p className="font-semibold pb-1">Tags</p>
								<div className="flex flex-row items-center gap-2">
									<Input placeholder="Healthy" name="tag" required={false} />
									<button type="button">
										<IoIosAddCircle color="green" size="25px" />
									</button>
								</div>
								{/* <TagsTable /> */}
							</div>
						</div>
					</div>
					<div className="text-center mt-3">
						<Button text="Valider la recette" />
					</div>
				</form>
			</div>
		</MaxWidthWrapper>
	);
}
