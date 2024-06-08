"use client";

import Link from "next/link";
import { SearchBar } from "../SearchBar";
import { IoIosAddCircle } from "react-icons/io";
import Fuse from "fuse.js";
import { useState } from "react";
import { HomePageRecipe } from "./HomePageRecipes";
import { RecipesProvider } from "recikeep/contexts/RecipesContext";
import { api } from "recikeep/trpc/react";

export function HomePageForm() {
	const { data, isLoading } = api.recipes.getRecipesByUserId.useQuery();
	const [input, setInput] = useState(data);

	if (data == null) {
		if (!isLoading) {
			return <>Error</>;
		}
		return <></>;
	}

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		if (value.length === 0) {
			setInput(data);
			return;
		}
		const fuse = new Fuse(data, {
			keys: ["name", "ingredients.name", "tags.name"],
		});

		const results = fuse.search(value);
		const items = results.map((result) => result.item);
		setInput(items);
		console.log(input);
	};

	return (
		<div className="pb-20 mx-auto flex flex-col">
			<RecipesProvider recipes={data}>
				<div className="py-20 w-full bg-pink-50 text-center">
					<h1 className="text-3xl font-semibold tracking-wide text-gray-800 sm:text-6xl">
						RECIKEEP.
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">
						Toutes tes recettes à disposition pour t'inspirer en cuisine.
					</p>
				</div>
				<div className="flex flex-col gap-4 w-full py-20 items-center text-center">
					<SearchBar handleSearchChange={handleSearchChange} />
				</div>

				<div className="flex flex-row gap-3 items-center">
					<h1 className="text-2xl font-semibold mb-2 pb-2 text-gray-800">
						TES RECETTES
					</h1>
					<hr className="flex-grow border-gray-400" />
				</div>

				<div className="w-full py-4">
					<ul className="min-w-full grid grid-cols-3 gap-4">
						<li className="p-3 flex flex-row items-center border border-slate-300 rounded-lg bg-emerald-800 hover:bg-emerald-900">
							<div className="font-medium text-gray-800 text-start px-2 grid flex-grow">
								<Link href={"/recipe"}>
									<div className="flex flex-row gap-4 justify-between">
										<p className="font-base text-white">Nouvelle recette</p>
										<button type="button">
											<IoIosAddCircle color="white" size="25px" />
										</button>
									</div>
								</Link>
							</div>
						</li>
						<HomePageRecipe />
					</ul>
				</div>
			</RecipesProvider>
		</div>
	);
}
