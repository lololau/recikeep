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
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import Link from "next/link";
import { useState } from "react";

function openInNewTab(url: string) {
	const win = window.open(url, "_blank");
	win?.focus();
}

function SourceLink({ source, link }: { source: string; link: string | null }) {
	if (link) {
		return (
			<button
				type="button"
				className="italic underline underline-offset-4 decoration-emerald-800 hover:text-emerald-800 text-sm sm:text-base text-left"
				onClick={() => openInNewTab(link)}
			>
				by {source}
			</button>
		);
	}
	return <p className="italic text-sm sm:text-base">by {source}</p>;
}

export default function RecipeForm({
	recipeId,
	isOwner,
}: { recipeId: string; isOwner?: boolean }) {
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
				<div className="w-full overflow-hidden relative">
					{recipe.main_image && (
						<img
							src={`https://utfs.io/f/${recipe.main_image}`}
							alt=""
							className="absolute inset-0 h-full w-full object-cover"
						/>
					)}
					<div className="flex flex-col gap-2 px-3 pt-14 w-full relative bg-white bg-opacity-60">
						<h1 className="font-gupter text-3xl font-semibold tracking-wide text-gray-800 sm:text-5xl">
							{recipe.title}
						</h1>
						<SourceLink source={recipe.source} link={recipe.sourceLink} />
						<div className="text-end py-1.5">
							{isOwner && (
								<Link href={`/recipe/${recipe.id}/update`}>
									<p className="sm:text-base text-sm italic text-emerald-800 px-2">
										Modifier la recette ?
									</p>
								</Link>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-row justify-around text-center items-center text-sm sm:text-lg text-white bg-emerald-800 w-full py-4 sm:py-5 rounded">
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
					{tags && tags.length > 0 && (
						<div className="hidden sm:flex sm:flex-row items-center gap-1 text-sm">
							{tags.map((tag) => (
								<Tag
									tagName={tag.name}
									bgColor="bg-white"
									textColor="text-emerald-800"
									key={tag.tagId}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-2 sm:flex-row self-start">
				<div className="sm:w-1/3 sticky top-0 sm:self-start sm:top-16">
					<div className="flex flex-col gap-4 py-5 bg-rose-50 rounded-2xl shadow-md px-6">
						<button
							type="button"
							onClick={() => setIsAccordionOpen(() => !isAccordionOpen)}
							className="font-gupter pl-2.5 text-xl sm:text-2xl text-center items-center flex sm:justify-center justify-between"
						>
							<span>Ingrédients 🥬</span>
							<span className="sm:hidden">
								{isAccordionOpen ? <BiChevronUp /> : <BiChevronDown />}
							</span>
						</button>
						{isAccordionOpen && (
							<div className="sm:self-center sm:pl-2.5">
								<IngredientsTable ingredients={ingredients} />
							</div>
						)}
					</div>
				</div>

				{tags && tags.length > 0 && (
					<div className="sm:hidden flex flex-wrap items-center justify-center gap-1 self-center sm:self-start text-sm px-2.5 my-3">
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

				<hr className="border-gray-200 border-dashed sm:hidden" />
				<div className="flex flex-col gap-4 pb-6 sm:pt-3 sm:pb-10 sm:w-2/3 rounded-2xl">
					{recipe.preparation && (
						<article className="w-full sm:pt-0 pt-3">
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
					)}

					{recipe.main_image && (
						<div className="self-center">
							<img
								src={`https://utfs.io/f/${recipe.main_image}`}
								alt=""
								className="max-w-60 sm:max-w-80 border-gray-300 rounded-xl sm:border-8 border-4"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
