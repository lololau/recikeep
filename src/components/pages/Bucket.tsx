"use client";

import { useState } from "react";
import { BucketCard } from "recikeep/components/BucketCard";
import { BucketModal } from "recikeep/components/BucketModal";
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
		<div className="bg-white z-20 sm:pb-0">
			<div className="mx-auto text-center items-center">
				<div className="px-3 py-14 w-full flex flex-col gap-3">
					<h1 className="font-gupter font-semibold text-3xl tracking-wide text-gray-800 sm:text-5xl">
						Backlog de recettes
					</h1>
					<p className="text-sm text-muted-foreground sm:text-lg">
						Enregistre une de tes recettes pré-sauvegardées !
					</p>
				</div>
			</div>
			<div className="sm:flex sm:flex-row w-full">
				<ul className="flex flex-col gap-3 p-2 sm:basis-1/4">
					<li className="w-full">
						<BucketModal />
					</li>
					<div className="flex flex-row gap-2 items-center py-3">
						<h1>RECETTES EN ATTENTE</h1>
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
				<div className="flex flex-col justify-center sm:basis-3/4 p-2 sm:p-0">
					<div className="sm:pl-3">
						{bucket != null && <NewRecipeForm initialData={bucket} />}
					</div>
				</div>
			</div>
		</div>
	);
}
