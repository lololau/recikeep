import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { api } from "recikeep/trpc/server";

export default async function RecipePage({
	params,
}: { params: { recipeId: string } }) {
	const recipe = await api.recipes.getRecipeById(params.recipeId);

	if (!recipe) {
		return (
			<MaxWidthWrapper>
				<div>
					<h1>
						Cette recette est introuvable. Cette page n'existe pas ou a été
						supprimée.
					</h1>
				</div>
			</MaxWidthWrapper>
		);
	}

	return (
		<MaxWidthWrapper>
			<div className="">
				<h1>Toto, la recette : {recipe.title} </h1>
			</div>
		</MaxWidthWrapper>
	);
}
