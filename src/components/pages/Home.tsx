"use client";

import Link from "next/link";
import { SearchBar } from "../SearchBar";
import { IoIosAddCircle } from "react-icons/io";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { HomePageRecipe } from "./HomePageRecipes";
import { RecipesProvider, useRecipes } from "recikeep/contexts/RecipesContext";
import { api } from "recikeep/trpc/react";
import type { RecipesFormated } from "recikeep/trpc/router/recipe";

function HomePageFormContent() {
	const { recipes } = useRecipes();
	const [query, setQuery] = useState("");
	const [filteredRecipes, setFilteredRecipes] = useState<RecipesFormated[]>([]);

	const fuse = useMemo(() => {
		return new Fuse(recipes, {
			keys: ["title", "ingredients.name", "tags.name"],
		});
	}, [recipes]);

	const handleSearchChange = (query: string) => {
		setQuery(query);
		const fuseSearch = fuse.search(query);

		setFilteredRecipes(fuseSearch.map((el) => el.item));
	};

	return (
		<>
			<div className="py-20 w-full bg-pink-50 text-center">
				<h1 className="text-3xl font-semibold tracking-wide text-gray-800 sm:text-6xl">
					RECIKEEP.
				</h1>
				<p className="mt-6 text-lg text-muted-foreground">
					Toutes tes recettes à disposition pour t'inspirer en cuisine.
				</p>
			</div>
			<div className="flex flex-col gap-4 w-full py-10 sm:py-20 items-center text-center">
				<SearchBar handleSearchChange={handleSearchChange} />
			</div>

			<div className="flex flex-row gap-3 items-center">
				<h1 className="text-xl sm:text-2xl font-semibold mb-2 pb-2 text-gray-800">
					TES RECETTES
				</h1>
				<hr className="flex-grow border-gray-400" />
			</div>

			<div className="w-full py-4">
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
		</>
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
		<div className="pb-20 mx-auto flex flex-col">
			<RecipesProvider recipes={data}>
				<HomePageFormContent />
			</RecipesProvider>
		</div>
	);
}
