"use client";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeExternalLinks from "rehype-external-links";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { api } from "recikeep/trpc/react";
import Markdown from "react-markdown";
import { IngredientsTable } from "../IngredientsTable";
import { CodeBlock, Pre } from "../Code";

export default function RecipeForm({ recipeId }: { recipeId: string }) {
	const { data: recipe } = api.recipes.getRecipeById.useQuery(recipeId);
	const { data: ingredients } =
		api.recipes.getIngredientsByRecipeId.useQuery(recipeId);
	const { data: tags } = api.recipes.getTagsByRecipeId.useQuery(recipeId);

	const options = { code: CodeBlock, pre: Pre };
	if (!recipe || !ingredients) {
		return (
			<MaxWidthWrapper>
				<div className="pb-10 mx-auto text-center flex flex-col items-center">
					<div className="py-20 w-full bg-ecru">
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
			<div className="mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-ecru">
					<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
						{recipe.title}
					</h1>
					<div className="flex flex-row justify-center divide-x-2 divide-gray-800 items-center text-lg mt-6 gap-2 text-gray-600">
						<p className="pr-3">Glucides : {recipe.glucides}</p>
						<p className="pl-3">Portions : {recipe.portions}</p>
					</div>
				</div>
			</div>
			{/* {tags && (
				<div className="flex flex-col pb-9">
					{tags.map((tag) => (
						<p key={tag.tagId}>{tag.name}</p>
					))}
				</div>
			)} */}
			<div className="flex flex-col">
				<div className="flex flex-col gap-5 pt-6 pb-3 sm:pt-10 sm:pb-5">
					<div className="hidden sm:flex sm:flex-row sm:gap-3 sm:items-center sm:visible">
						<h1 className="text-gray-800 text-xl sm:text-2xl font-semibold text-center sm:text-left mb-4">
							Ingrédients 🥗
						</h1>
						<hr className="flex-grow border-gray-300" />
					</div>
					<h1 className="text-gray-800 text-xl visible sm:hidden font-semibold text-center mb-4">
						Ingrédients 🥗
					</h1>
					<IngredientsTable ingredients={ingredients} />
				</div>
				<div className="flex flex-col gap-2 pt-3 pb-6 sm:pt-5 sm:pb-10">
					<div className="flex-row gap-3 items-center hidden sm:flex sm:visible">
						<h1 className="text-xl sm:text-2xl text-gray-800 font-semibold text-center sm:text-left mb-4">
							Recette 🍴
						</h1>
						<hr className="flex-grow border-gray-300" />
					</div>
					<h1 className="text-gray-800 text-xl visible sm:hidden font-semibold text-center">
						Recette 🧑🏻‍🍳
					</h1>
					{recipe.preparation && (
						<div>
							<article className="w-full pt-5">
								<Markdown
									className="prose min-w-full"
									components={options}
									remarkPlugins={[remarkGfm]}
									rehypePlugins={[
										rehypeSanitize,
										[
											rehypeExternalLinks,
											{ content: { type: "text", value: " 🔗" } },
										],
									]}
								>
									{recipe.preparation}
								</Markdown>
							</article>
						</div>
					)}
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
