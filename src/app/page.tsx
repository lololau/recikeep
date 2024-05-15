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

				<div className="flex flex-row items-center gap-4 self-start pb-2">
					<h1 className="self-start text-lg font-semibold mb-2">
						Tes recettes
					</h1>
					<Link href="/recipe">
						<button type="button">
							<IoIosAddCircle color="green" size="25px" />
						</button>
					</Link>
				</div>

				{recipes.length > 0 && (
					<div className="w-full">
						<ul className="min-w-full grid grid-cols-3 gap-4">
							{recipes.map((recipe, index) => {
								return (
									<li
										key={`${recipe.id}—${index}`}
										className="p-4 flex flex-row items-center border border-slate-300 rounded-lg"
									>
										<div className="font-medium text-gray-800 text-start px-2 grid flex-grow">
											<Link href={`/recipe/${recipe.id}`}>
												<p>{recipe.title}</p>
											</Link>
										</div>
										<div>
											<button
												type="button"
												className="flex-auto w-10 text-base font-semibold text-green-600 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none"
											>
												<FaPencilAlt />
											</button>
										</div>
										<div>
											<button
												type="button"
												className="flex-auto text-base font-semibold text-green-600 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none"
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
