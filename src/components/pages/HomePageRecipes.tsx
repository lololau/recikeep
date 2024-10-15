"use client";

import Link from "next/link";
import { HiPencil } from "react-icons/hi";
import type { RecipesFormated } from "recikeep/trpc/router/recipe";
import { Tag } from "../Tag";
import { MdImageNotSupported } from "react-icons/md";

export function HomePageRecipe({ recipes }: { recipes: RecipesFormated[] }) {
	return (
		<>
			{recipes.map((recipe, index) => {
				return (
					<li
						key={`${recipe.id}—${index}`}
						className="p-3 items-center border border-slate-300 rounded-lg hover:bg-gray-100"
					>
						<Link href={`/recipe/${recipe.id}`}>
							<div className="grid grid-cols-1 h-full content-between">
								<div className="self-center">
									<div className="max-w-fit">
										{recipe.main_image && (
											<img
												src={`https://utfs.io/f/${recipe.main_image}`}
												alt="salade"
												className="w-[144px] max-h-[191px] sm:w-[262px] sm:max-h-[350px]"
											/>
										)}
										{!recipe.main_image && (
											<div className="w-[144px] h-[191px] sm:w-[262px] sm:h-[350px] bg-gray-200 flex flex-col items-center justify-center">
												<p className="italic text-gray-800 text-sm sm:text-base">
													Image manquante
												</p>
												<div className="text-3xl sm:text-6xl">
													<MdImageNotSupported />
												</div>
											</div>
										)}
									</div>
								</div>

								<div className="flex flex-col text-start text-gray-800 font-light">
									<p className="sm:text-base text-sm">{recipe.title}</p>
									<p className="font-base text-gray-600 sm:text-sm text-xs">
										Ref: {recipe.source}
									</p>
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
						</Link>
					</li>
				);
			})}
		</>
	);
}
