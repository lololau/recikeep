"use client";

import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { api } from "recikeep/trpc/react";
import NewRecipeForm, { type IFormRecipe } from "./NewRecipe";

export default function UpdateRecipeForm({ recipeId }: { recipeId: string }) {
	const { data: recipe } = api.recipes.getRecipeById.useQuery(recipeId);
	const { data: ingredients } =
		api.recipes.getIngredientsByRecipeId.useQuery(recipeId);
	const { data: tags } = api.recipes.getTagsByRecipeId.useQuery(recipeId);

	if (!recipe || !ingredients) {
		return (
			<MaxWidthWrapper>
				<div className="pb-10 mx-auto text-center flex flex-col items-center">
					<div className="py-20 w-full bg-pink-50">
						<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
							Recette introuvable
						</h1>
						<p className="mt-6 text-lg text-muted-foreground">
							Cette page n'existe pas ou a été supprimée.
						</p>
					</div>
				</div>
			</MaxWidthWrapper>
		);
	}

	const initialData: IFormRecipe = {
		...recipe,
		ingredients,
		tags,
	};

	const recipeDetails = {
		recipeId: recipe.id,
		preparation: recipe.preparation,
	};

	return (
		<MaxWidthWrapper>
			<div className="pb-10 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-pink-50">
					<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
						Modification d'une recette
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">
						Que souhaites-tu changer ?
					</p>
				</div>
			</div>
			<NewRecipeForm
				updateInitialData={initialData}
				recipeDetails={recipeDetails}
			/>
		</MaxWidthWrapper>
	);
}