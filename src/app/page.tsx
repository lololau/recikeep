import Link from "next/link";
import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { SearchBar } from "recikeep/components/SearchBar";
import { api } from "recikeep/trpc/server";

export default async function HomePage() {
	const { session } = await validateRequest();
	if (!session) {
		redirect("/login");
	}

	const recipes = [
		{ title: "Tarte poireaux lardons", createdAt: new Date(), id: 1 },
		{
			title: "Risotto courgettes pistaches",
			createdAt: new Date("2024-03-12"),
			id: 2,
		},
	];
	// const { recipes } = await api.recipes.getRecipesByUserId()

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
				<div className="flex flex-col gap-4 mt-10">
					<p>Quelle recette veux-tu cuisiner ?</p>
					<div className="self-center">
						<SearchBar />
					</div>
				</div>
				<div>
					{recipes.map((recipe) => (
						<div key={`${recipe.id}_${recipe.title}`}>
							<Link href={`/recipe/${recipe.id}`}>
								<div>
									<p>{recipe.title}</p>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
