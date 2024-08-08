"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { RecipesProvider, useRecipes } from "recikeep/contexts/RecipesContext";
import { api } from "recikeep/trpc/react";
import type { RecipesFormated } from "recikeep/trpc/router/recipe";
import { SearchBar } from "../SearchBar";
import { HomePageRecipe } from "./HomePageRecipes";

function HomePageFormContent() {
	const { recipes } = useRecipes();
	const [query, setQuery] = useState("");
	const [filteredRecipes, setFilteredRecipes] = useState<RecipesFormated[]>([]);

	const fuse = useMemo(() => {
		return new Fuse(recipes, {
			keys: [
				{ name: "title", weight: 0.5 },
				{ name: "ingredients.name", weight: 0.25 },
				{ name: "tags.name", weight: 0.25 },
			],
			isCaseSensitive: false,
			findAllMatches: true,
			includeMatches: true,
			includeScore: true,
			useExtendedSearch: false,
			threshold: 0.3,
			ignoreLocation: true,
			distance: 2,
		});
	}, [recipes]);

	const handleSearchChange = (query: string) => {
		if (query === "") {
			setQuery(query);
			for (const recipe of recipes) {
				recipe.filters = [];
			}
		}

		if (query.length > 1) {
			setQuery(query);
			const fuseSearch = fuse.search(query);

			setFilteredRecipes(
				fuseSearch.map((el) => {
					el.item.filters = [];

					const matches = el.matches ?? [];
					// let matchFilters: string[] = [];
					for (let i = 0; i < matches?.length; i++) {
						const match = matches[i];

						if (match.value) {
							if (el.item.filters.includes(match.value)) {
								continue;
							}
							el.item.filters.push(match.value);
						}
					}

					return el.item;
				}),
			);
		}
	};

	return (
		<div className="sm:pb-0 pb-14">
			<div className="pt-14 w-full text-center px-0">
				<h1 className="text-4xl font-semibold tracking-wide text-gray-800 sm:text-6xl">
					RECIKEEP.
				</h1>
				<p className="mt-6 text-lg text-muted-foreground">
					Toutes tes recettes à disposition pour t'inspirer en cuisine.
				</p>
			</div>
			<div className="flex flex-col gap-4 w-full py-10 items-center text-center">
				<SearchBar handleSearchChange={handleSearchChange} />
			</div>

			<div className="flex flex-row gap-3 items-center px-2.5 sm:px-0">
				<h1 className="text-xl sm:text-2xl font-semibold mb-2 pb-2 text-gray-800">
					TES RECETTES
				</h1>
				<hr className="flex-grow border-gray-400" />
			</div>

			<div className="w-full py-4  px-2.5 sm:px-0">
				<ul className="min-w-full grid grid-cols-2 gap-4 sm:grid-cols-3">
					<li className="p-2 sm:p-3 flex flex-row items-center border border-slate-300 rounded-lg bg-emerald-800 hover:bg-emerald-900">
						<div className="font-medium text-gray-800 text-start px-2 grid flex-grow">
							<Link href={"/recipe"}>
								<div className="flex flex-row gap-4 justify-between">
									<p className="text-sm sm:text-base font-base text-white">
										Nouvelle recette
									</p>
									<button type="button">
										<IoIosAddCircle color="white" size="25px" />
									</button>
								</div>
							</Link>
						</div>
					</li>
					<HomePageRecipe recipes={query === "" ? recipes : filteredRecipes} />
				</ul>
			</div>
		</div>
	);
}

export function HomePageForm() {
	const { data, isLoading } = api.recipes.getRecipesByUserId.useQuery();

	if (data == null) {
		if (!isLoading) {
			return <>Error</>;
		}
		return <></>;
	}

	return (
		<div className="mx-auto flex flex-col bg-white z-20">
			<RecipesProvider recipes={data}>
				<HomePageFormContent />
			</RecipesProvider>
		</div>
	);
}
