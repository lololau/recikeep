"use client";

import { useState } from "react";
import { BucketCard } from "recikeep/components/BucketCard";
import { BucketModal } from "recikeep/components/BucketModal";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import NewRecipeForm from "recikeep/components/pages/NewRecipe";
import { api } from "recikeep/trpc/react";

export default function BucketForm() {
	const { data: buckets } = api.buckets.getBucketsByUserId.useQuery();

	const bucketsToShow = [];
	if (buckets) {
		for (const el of buckets) {
			if (!el.recipeId) {
				bucketsToShow.push(el);
			}
		}
	}

	const [bucket, setBucket] = useState<
		| {
				bucketId: string;
				recipeTitle: string;
				source: string;
		  }
		| undefined
	>(undefined);

	return (
		<MaxWidthWrapper>
			<div className="pb-10 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-ecru">
					<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
						Backlog de recettes
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">
						Enregistre une de tes recettes pré-sauvegardées !
					</p>
				</div>
			</div>
			<div className="flex flex-row mx-auto">
				<ul className="flex flex-col gap-3 p-2 basis-1/4">
					<li className="w-full">
						<BucketModal />
					</li>
					<div className="flex flex-row gap-2 items-center py-3">
						<h1 className="text-emerald-800">RECETTES EN ATTENTE</h1>
						<hr className="border-gray-500 flex-grow" />
					</div>
					{bucketsToShow &&
						bucketsToShow.length > 0 &&
						bucketsToShow.map((bucket, index) => {
							return (
								<li
									key={`${bucket.id}—${index}`}
									className="flex flex-col p-2 border bg-gray-100 border-slate-300 rounded-lg hover:bg-gray-400 hover:text-white"
								>
									<BucketCard
										source={bucket.source}
										recipeTitle={bucket.recipeTitle}
										onClick={() => {
											setBucket({
												bucketId: bucket.id,
												source: bucket.source,
												recipeTitle: bucket.recipeTitle,
											});
										}}
									/>
								</li>
							);
						})}
				</ul>
				<div className="flex flex-col justify-center basis-3/4">
					<div className="pl-3">
						{bucket != null && <NewRecipeForm initialData={bucket} />}
					</div>
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
