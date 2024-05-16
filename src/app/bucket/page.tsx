import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { BucketCard } from "recikeep/components/BucketCard";
import { BucketModal } from "recikeep/components/BucketModal";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import NewRecipeForm from "recikeep/components/pages/NewRecipe";
import { api } from "recikeep/trpc/server";

export default async function NewRecipePage() {
	const { session } = await validateRequest();
	if (session == null) {
		return redirect("/login");
	}

	const buckets = await api.buckets.getBucketsByUserId();
	console.log("buckets", buckets);

	return (
		<MaxWidthWrapper>
			<div className="pb-10 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-pink-50">
					<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
						Backlog de recettes
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">
						Enregistre une de tes recettes sauvegardées !
					</p>
				</div>
			</div>
			<div className="flex flex-row divide-x-2 divide-black mx-auto">
				<div className="flex flex-col">
					<ul className="flex-grow bg-gray-200 py-2 px-2">
						<li className="p-3 flex flex-row items-center border border-slate-300 rounded-lg bg-emerald-800 hover:bg-emerald-900">
							<div className="font-medium  px-2 grid flex-grow">
								<BucketModal />
							</div>
						</li>
						{buckets.map((bucket, index) => {
							return (
								<li
									key={`${bucket.id}—${index}`}
									className="p-3 flex flex-row items-center border border-slate-300 rounded-lg hover:bg-gray-100"
								>
									<BucketCard
										source={bucket.source}
										recipeTitle={bucket.recipeTitle}
									/>
								</li>
							);
						})}
					</ul>
				</div>
				<div className="flex flex-col justify-center flex-grow">
					<div className="pl-3">
						<NewRecipeForm />
					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
