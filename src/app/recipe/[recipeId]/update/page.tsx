import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import UpdateRecipeForm from "recikeep/components/pages/UpdateRecipe";
import { createServerHelper } from "recikeep/trpc/server";

export default async function UpdateRecipePage({
	params,
}: { params: { recipeId: string } }) {
	const { session } = await validateRequest();
	if (session == null) {
		return redirect("/login");
	}

	const helpers = await createServerHelper();
	await helpers.recipes.getRecipeById.prefetch(params.recipeId);
	await helpers.recipes.getIngredientsByRecipeId.prefetch(params.recipeId);
	await helpers.recipes.getTagsByRecipeId.prefetch(params.recipeId);

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<UpdateRecipeForm recipeId={params.recipeId} />
		</HydrationBoundary>
	);
}
