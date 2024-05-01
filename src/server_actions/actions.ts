"use server";

import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";
import type { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";
import { api } from "recikeep/trpc/server";

export async function createRecipe(_: unknown, formData: FormData) {
	const title = formData.get("title") as string;
	const preparation = formData.get("preparation") as string;
	const portions = formData.get("portions") as string;
	const glucides = formData.get("glucides") as string;
	const ingredients = formData.get("ingredients") as unknown as Array<{
		name: string;
		quantity: string;
	}>;
	const tags = formData.get("tags") as unknown as Array<string>;

	if (
		title == null ||
		portions == null ||
		ingredients == null ||
		tags == null
	) {
		return { error: "Missing data to create recipe" };
	}

	const recipe = await api.recipes.createRecipe({
		title: title,
		preparation: preparation,
		portions: Number(portions),
		glucides: glucides,
		ingredients,
		tags,
	});
	console.log(recipe.id);

	return redirect(`/recipe/${recipe.id}`);
}

// export async function getRecipesByUserId(
// 	req: NextApiRequest,
// 	res: NextApiResponse,
// ) {
// 	try {
// 		const recipes = await api.recipes.getRecipesByUserId();
// 		res.status(200).json({ recipes });
// 	} catch (err) {
// 		if (err instanceof TRPCError) {
// 			const httpStatusCode = getHTTPStatusCodeFromError(err);
// 			res.status(httpStatusCode).json({ error: { message: err.message } });
// 			return;
// 		}
// 		res.status(500).json({
// 			error: { message: "Error while gettings recipes by userId" },
// 		});
// 	}
// }

// export async function getRecipeById(id: string) {
// 	const recipe = await api.recipes.getRecipeById(id);
// 	try {
// 		const recipe = await api.recipes.getRecipeById(id);
// 		console.log(recipe);
// 		return recipe;
// 	} catch (err) {
// 		console.error(err);
// 	}
// }
