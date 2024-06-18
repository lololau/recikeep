"use client";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeExternalLinks from "rehype-external-links";
import { api } from "recikeep/trpc/react";
import Markdown from "react-markdown";
import { IngredientsTable } from "../IngredientsTable";
import { CodeBlock, Pre } from "../Code";
import { Tag } from "../Tag";

export default function RecipeForm({ recipeId }: { recipeId: string }) {
	const { data: recipe } = api.recipes.getRecipeById.useQuery(recipeId);
	const { data: ingredients } =
		api.recipes.getIngredientsByRecipeId.useQuery(recipeId);
	const { data: tags } = api.recipes.getTagsByRecipeId.useQuery(recipeId);

	const options = { code: CodeBlock, pre: Pre };
	if (!recipe || !ingredients) {
		return (
			<>
				<div className="pb-10 mx-auto text-center flex flex-col items-center">
					<div className="py-10 sm:py-20 w-full bg-ecru">
						<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
							Recette introuvable
						</h1>
						<p className="mt-6 text-lg text-muted-foreground">
							Cette page n'existe pas ou a été supprimée.
						</p>
					</div>
				</div>
			</>
		);
	}

	return (
		<div className="mx-auto z-20 min-h-screen bg-white sm:pb-0 pb-14">
			<div className="mx-auto text-center flex flex-col items-center z-20">
				<div className="py-12 sm:py-20 w-full ">
					<h1 className="text-2xl text-gray-800 sm:text-5xl px-2 sm:px-0">
						{recipe.title}
					</h1>
				</div>
				<div className="flex flex-row justify-around items-center text-sm sm:text-lg  text-white bg-emerald-800 w-full py-4 sm:py-5 rounded">
					{recipe.glucides && <p>Glucides : {recipe.glucides}</p>}
					<p>Portions : {recipe.portions}</p>
				</div>
			</div>
			<div className="flex flex-col">
				<div className="flex flex-col gap-5 mt-3 pt-5 pb-8 sm:pb-5 bg-rose-50 rounded-2xl">
					<div className="hidden sm:flex sm:flex-row sm:gap-3 sm:items-center sm:visible">
						<h1 className="pl-2.5 sm:text-2xl sm:text-center">
							Ingrédients 🥬
						</h1>
					</div>
					<h1 className="text-xl visible sm:hidden font-light text-center">
						Ingrédients 🥬
					</h1>
					<div className="self-center sm:self-start sm:pl-2.5">
						<IngredientsTable ingredients={ingredients} />
					</div>
				</div>

				{tags && (
					<div className="my-3 self-center sm:self-start px-2.5">
						{tags.map((tag) => (
							<Tag tagName={tag.name} key={tag.tagId} />
						))}
					</div>
				)}
				<hr className="border-gray-200 border-dashed" />
				<div className="flex flex-col gap-2 pb-6 pt-3 sm:pb-10 rounded-2xl">
					{recipe.preparation && (
						<div>
							<article className="w-full sm:pt-0 pt-5">
								<Markdown
									className="prose min-w-full px-2.5"
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
		</div>
	);
}
