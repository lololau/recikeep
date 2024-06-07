import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { SearchBar } from "recikeep/components/SearchBar";
import Link from "next/link";
import { IoIosAddCircle } from "react-icons/io";
import { HomePageRecipe } from "recikeep/components/pages/HomePageRecipes";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { createServerHelper } from "recikeep/trpc/server";

export default async function HomePage() {
	const { session } = await validateRequest();
	if (!session) {
		redirect("/login");
	}

	const helpers = await createServerHelper();

	await helpers.recipes.getRecipesByUserId.prefetch();

	const dehydratedState = dehydrate(helpers.queryClient);

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
						<HydrationBoundary state={dehydratedState}>
							<HomePageRecipe />
						</HydrationBoundary>
					</ul>
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
