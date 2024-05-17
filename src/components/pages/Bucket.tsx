"use client";

import { useState } from "react";
import { BucketCard } from "recikeep/components/BucketCard";
import { BucketModal } from "recikeep/components/BucketModal";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import NewRecipeForm from "recikeep/components/pages/NewRecipe";

export default function BucketForm({
	buckets,
}: { buckets: { recipeTitle: string; source: string; id: string }[] }) {
	const [bucketId, setBucketId] = useState("");

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
			<div className="flex flex-row divide-x-2 divide-gray-800 divide-opacity-75 mx-auto">
				<ul className="flex flex-col flex-grow gap-3 p-2 ">
					<li className="w-full">
						<BucketModal />
					</li>
					<div className="flex flex-row gap-2 items-center py-3">
						<h1 className="text-emerald-800">RECETTES EN ATTENTE</h1>
						<hr className="border-gray-500 flex-grow" />
					</div>
					{buckets.map((bucket, index) => {
						return (
							<li
								key={`${bucket.id}—${index}`}
								className="flex flex-col p-2 border  bg-gray-100 border-slate-300 rounded-lg hover:bg-gray-400 hover:text-white"
							>
								<BucketCard
									source={bucket.source}
									recipeTitle={bucket.recipeTitle}
									onClick={() => {
										setBucketId(bucket.id);
										console.log(bucketId);
									}}
								/>
							</li>
						);
					})}
				</ul>
				<div className="flex flex-col justify-center flex-grow">
					<div className="pl-3">
						<NewRecipeForm bucketId={bucketId} />
					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
