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

	const { data: user } = api.auth.getMe.useQuery();

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
			<div className="flex flex-row items-center pt-14 w-full text-center justify-center gap-3 px-0">
				<div>
					<h1 className="text-3xl font-semibold font-gupter tracking-wide text-gray-800 sm:text-5xl">
						Les recettes de {user?.pseudo}
					</h1>
					<p className="mt-3 text-xs font-light sm:text-lg">
						Toutes tes recettes à disposition pour t'inspirer en cuisine.
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-4 py-10 items-center text-center">
				<SearchBar handleSearchChange={handleSearchChange} />
			</div>
			<div className="flex flex-row gap-3 items-center px-2.5 sm:px-0">
				<h1 className="text-xl sm:text-2xl font-semibold mb-2 pb-2 text-gray-800">
					TES RECETTES
				</h1>
				<hr className="flex-grow border-gray-400" />
				<div className="sm:hidden">
					<Link href={"/recipe"}>
						<button type="button">
							<IoIosAddCircle color="065f46" size="25px" />
						</button>
					</Link>
				</div>
			</div>
			<div className="py-4  px-2.5 sm:px-0">
				<ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					<HomePageRecipe recipes={query === "" ? recipes : filteredRecipes} />
				</ul>
			</div>
		</div>
	);
}

export function HomePageForm() {
	console.log("getRecipesByUser - call useQuery");
	const { data, isLoading, isError } =
		api.recipes.getRecipesByUserId.useQuery();

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
