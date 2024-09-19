"use client";
import Markdown from "react-markdown";
import { api } from "recikeep/trpc/react";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { CodeBlock, Pre } from "../Code";
import { IngredientsTable } from "../IngredientsTable";
import { Tag } from "../Tag";
import { PiForkKnifeFill } from "react-icons/pi";
import { MdEnergySavingsLeaf } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";

export default function RecipeForm({ recipeId }: { recipeId: string }) {
	const [isAccordionOpen, setIsAccordionOpen] = useState(true);

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
		<div className="mx-auto z-20 bg-white sm:pb-0 pb-14">
			<div className="mx-auto flex flex-col items-center z-20">
				<div className="flex flex-col gap-2 px-3 pt-14 w-full">
					<h1 className="font-gupter text-3xl font-semibold tracking-wide text-gray-800 sm:text-5xl">
						{recipe.title}
					</h1>
					<p className="italic text-sm sm:text-base">by {recipe.source}</p>
					<div className="text-end">
						<Link href={`/recipe/${recipe.id}/update`}>
							<p className="sm:text-base text-sm italic text-emerald-800 py-1.5 px-2">
								Modifier la recette ?
							</p>
						</Link>
					</div>
				</div>
				<div className="flex flex-row justify-around text-center items-center text-sm sm:text-lg  text-white bg-emerald-800 w-full py-4 sm:py-5 rounded">
					{recipe.glucides && (
						<div className="flex flex-row items-center">
							<MdEnergySavingsLeaf />
							<p>: {recipe.glucides}</p>
						</div>
					)}
					<div className="flex flex-row items-center">
						<PiForkKnifeFill />
						<p>: {recipe.portions}</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2 sm:flex-row">
				<div className="sm:w-1/3 sticky top-0 sm:top-auto">
					<div className="flex flex-col gap-5 py-5 bg-rose-50 rounded-2xl shadow-md px-6">
						<div className="hidden sm:flex sm:flex-row sm:gap-3 sm:items-center sm:visible">
							<h1 className="font-gupter pl-2.5 sm:text-2xl sm:text-center">
								Ingrédients 🥬
							</h1>
						</div>
						<button
							type="button"
							onClick={() => setIsAccordionOpen(!isAccordionOpen)}
							className="font-gupter text-xl visible sm:hidden font-light text-center"
						>
							<span>Ingrédients 🥬</span>
						</button>
						{isAccordionOpen && (
							<div className="self-center sm:self-start sm:pl-2.5">
								<IngredientsTable ingredients={ingredients} />
							</div>
						)}
					</div>
				</div>

				{tags && tags.length > 0 && (
					<div className="flex flex-wrap items-center justify-center gap-1 self-center text-sm sm:hidden px-2.5 my-3">
						{tags.map((tag) => (
							<Tag
								tagName={tag.name}
								bgColor="bg-emerald-800"
								textColor="text-white"
								key={tag.tagId}
							/>
						))}
					</div>
				)}

				<hr className="border-gray-200 border-dashed" />
				<div className="flex flex-col gap-2 pb-6 sm:pt-3 sm:pb-10 rounded-2xl">
					{recipe.preparation && (
						<div>
							<article className="w-full sm:pt-0 pt-5">
								<Markdown
									className="prose px-2.5 max-w-fit"
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
