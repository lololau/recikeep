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
					<Link href={`/recipe/${recipe.id}`} key={`${recipe.id}—${index}`}>
						<li className="p-3 items-center border border-slate-300 rounded-lg hover:bg-gray-100">
							<div className="flex flex-col">
								<div className="self-center">
									{recipe.main_image && (
										<div className="max-w-fit">
											<img
												src={`https://utfs.io/f/${recipe.main_image}`}
												alt="salade"
											/>
										</div>
									)}
								</div>

								<div className="flex flex-row items-center">
									<div className="font-light text-gray-800 text-start grid flex-grow">
										<p className="sm:text-base text-sm">{recipe.title}</p>
										<p className="font-base text-gray-600 sm:text-sm text-xs">
											Ref: {recipe.source}
										</p>
									</div>
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
					</Link>
				);
			})}
		</>
	);
}
