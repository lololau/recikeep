import { IngredientsTable } from "recikeep/components/IngredientsTable";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { api } from "recikeep/trpc/server";

export default async function RecipePage({
	params,
}: { params: { recipeId: string } }) {
	const recipe = await api.recipes.getRecipeById(params.recipeId);
	const ingredients = await api.recipes.getIngredientsByRecipeId(
		params.recipeId,
	);
	// const tags

	if (!recipe) {
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

	return (
		<MaxWidthWrapper>
			<div className="pb-10 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-pink-50">
					<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
						{recipe.title}
					</h1>
					<p className="items-center text-lg mt-6 gap-2">
						{recipe.description}
					</p>
				</div>
			</div>
			<div>
				<IngredientsTable ingredients={ingredients} />
			</div>
		</MaxWidthWrapper>
	);
}
