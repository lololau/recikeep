import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { HiPencil } from "react-icons/hi2";
import { SearchBar } from "recikeep/components/SearchBar";
import { api } from "recikeep/trpc/server";
import Link from "next/link";
import { IoIosAddCircle } from "react-icons/io";

export default async function HomePage() {
	const { session } = await validateRequest();
	if (!session) {
		redirect("/login");
	}

	const recipes = await api.recipes.getRecipesByUserId();

	return (
		<MaxWidthWrapper>
			<div className="pb-20 mx-auto flex flex-col">
				<div className="py-20 w-full bg-pink-50 text-center">
					<h1 className="text-3xl font-semibold tracking-wide text-gray-800 sm:text-6xl">
						RECIKEEP.
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">
						Toutes tes recettes à disposition pour t'inspirer en cuisine.
					</p>
				</div>
				<div className="flex flex-col gap-4 w-full py-20 items-center text-center">
					<SearchBar />
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
										<button
											type="button"
											className="text-xl font-semibold text-emerald-600 hover:text-emerald-800 disabled:opacity-50 disabled:pointer-events-none"
										>
											<HiPencil color="#065f46" />
										</button>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
