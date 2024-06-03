import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import RecipeForm from "recikeep/components/pages/Recipe";
import { createServerHelper } from "recikeep/trpc/server";

export default async function RecipePage({
	params,
}: { params: { recipeId: string } }) {
	const helpers = await createServerHelper();
	await helpers.recipes.getRecipeById.prefetch(params.recipeId);
	await helpers.recipes.getIngredientsByRecipeId.prefetch(params.recipeId);
	await helpers.recipes.getTagsByRecipeId.prefetch(params.recipeId);

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<RecipeForm recipeId={params.recipeId} />
		</HydrationBoundary>
	);
}
