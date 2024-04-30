"use client";

import { useParams } from "next/navigation";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { getRecipeById } from "recikeep/server_actions/actions";
import { api } from "recikeep/trpc/server";

export default async function RecipePage() {
	const recipeId = useParams().recipe;

	if (!recipeId) {
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

	if (typeof recipeId !== "string") {
		return (
			<MaxWidthWrapper>
				<div>Error</div>
			</MaxWidthWrapper>
		);
	}

	const recipe = await getRecipeById(recipeId);

	return (
		<MaxWidthWrapper>
			<div className="">
				<h1>Toto, la recette {recipeId} </h1>
			</div>
		</MaxWidthWrapper>
	);
}
