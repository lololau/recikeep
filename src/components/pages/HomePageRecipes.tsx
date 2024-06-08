"use client";

import Link from "next/link";
import { HiPencil } from "react-icons/hi2";
import type { RecipesFormated } from "recikeep/trpc/router/recipe";

export function HomePageRecipe({ recipes }: { recipes: RecipesFormated[] }) {
	return (
		<>
			{recipes.map((recipe, index) => {
				return (
					<li
						key={`${recipe.id}—${index}`}
						className="p-3 flex flex-row items-center border border-slate-300 rounded-lg hover:bg-gray-100"
					>
						<div className="font-light text-gray-800 text-start px-2 grid flex-grow">
							<Link href={`/recipe/${recipe.id}`}>
								<p>{recipe.title}</p>
								<p className="font-base text-gray-500 text-xs">
									Reference: {recipe.source}
								</p>
							</Link>
						</div>
						<div>
							<Link href={`/recipe/${recipe.id}/update`}>
								<button
									type="button"
									className="text-xl font-semibold text-emerald-600 hover:text-emerald-800 disabled:opacity-50 disabled:pointer-events-none"
								>
									<HiPencil color="#065f46" />
								</button>
							</Link>
						</div>
					</li>
				);
			})}
		</>
	);
}
