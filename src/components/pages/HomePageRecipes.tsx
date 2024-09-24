"use client";

import Link from "next/link";
import { HiPencil } from "react-icons/hi";
import type { RecipesFormated } from "recikeep/trpc/router/recipe";
import { Tag } from "../Tag";

export function HomePageRecipe({ recipes }: { recipes: RecipesFormated[] }) {
	return (
		<>
			{recipes.map((recipe, index) => {
				return (
					<li
						key={`${recipe.id}—${index}`}
						className="p-3 items-center border border-slate-300 rounded-lg hover:bg-gray-100"
					>
						<div className="flex flex-col">
							<div className="h-20 sm:h-40 items-center overflow-hidden bg-center">
								<img
									src="https://images.ricardocuisine.com/services/recipes/992x1340_9042.jpg"
									alt="salade"
									className="-translate-y-1/3"
								/>
							</div>

							<div className="flex flex-row items-center">
								<div className="font-light text-gray-800 text-start px-2 grid flex-grow">
									<Link href={`/recipe/${recipe.id}`}>
										<p className="sm:text-base text-sm">{recipe.title}</p>
										<p className="font-base text-gray-600 sm:text-sm text-xs">
											Ref: {recipe.source}
										</p>
									</Link>
								</div>

								<Link
									href={`/recipe/${recipe.id}/update`}
									className="text-xl font-semibold text-emerald-600 hover:text-emerald-800 disabled:opacity-50"
								>
									<HiPencil color="#065f46" />
								</Link>
							</div>
						</div>

						<div className="flex flex-row gap-1 flex-wrap mt-1">
							{recipe.filters?.map((filter, index) => (
								<Tag
									tagName={filter}
									textColor="text-emerald-800"
									bgColor="bg-rose-50"
									key={`${filter}-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										index
									}`}
									textSize="xs"
								/>
							))}
						</div>
					</li>
				);
			})}
		</>
	);
}
