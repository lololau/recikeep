import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import RecipeForm from "recikeep/components/pages/Recipe";
import { createServerHelper } from "recikeep/app/api/trpc/[trpc]/route";
import { validateRequest } from "recikeep/auth/auth";
import { api } from "recikeep/trpc/server";

export default async function RecipePage({
	params,
}: { params: { recipeId: string } }) {
	// Find if recipe was created by the owner
	let isOwner = false;
	const { user } = await validateRequest();
	const recipe = await api.recipes.getRecipeById(params.recipeId);

	if (recipe && user && recipe.userId === user.id) {
		isOwner = true;
	}

	const helpers = await createServerHelper();
	await helpers.recipes.getRecipeById.prefetch(params.recipeId);
	await helpers.recipes.getIngredientsByRecipeId.prefetch(params.recipeId);
	await helpers.recipes.getTagsByRecipeId.prefetch(params.recipeId);

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<MaxWidthWrapper>
			<HydrationBoundary state={dehydratedState}>
				<RecipeForm recipeId={params.recipeId} isOwner={isOwner} />
			</HydrationBoundary>
		</MaxWidthWrapper>
	);
}
