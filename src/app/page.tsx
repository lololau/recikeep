import { redirect } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { FaPencilAlt } from "react-icons/fa";
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
			<div className="pb-20 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-pink-50">
					<h1 className="text-3xl font-semibold tracking-wide text-gray-800 sm:text-6xl">
						RECIKEEP.
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">
						Toutes tes recettes à disposition pour t'inspirer en cuisine.
					</p>
				</div>
				<div className="flex flex-col gap-4 w-full py-20 items-center">
					<SearchBar />
				</div>

				{recipes.length === 0 && (
					<Link href="/recipe">
						<button
							type="button"
							className="bg-green-700 text-white rounded-md py-1.5 px-2 w-max text-sm sm:text-base"
						>
							<div className="flex flex-row items-center gap-2">
								<p>Crée ta première recette</p>
								<IoIosAddCircle color="white" size="25px" />
							</div>
						</button>
					</Link>
				)}
				{recipes.length > 0 && (
					<div className="border border-slate-300 rounded-lg w-full">
						<ul className="min-w-full divide-y divide-gray-200">
							{recipes.map((recipe, index) => {
								return (
									<li
										key={`${recipe.id}—${index}`}
										className="p-4 grid grid-cols-8"
									>
										<div className="font-medium text-gray-800 text-start px-2 grid col-span-6">
											<Link href={`/recipe/${recipe.id}`}>
												<p>{recipe.title}</p>
											</Link>
										</div>
										<div>
											<button
												type="button"
												className="items-center text-lg font-semibold text-green-600 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none"
											>
												<FaPencilAlt />
											</button>
										</div>
										<div>
											<button
												type="button"
												className="items-center text-lg font-semibold text-green-600 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none"
											>
												<MdDeleteOutline />
											</button>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</MaxWidthWrapper>
	);
}
