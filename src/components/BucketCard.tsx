import type { IBucket } from "recikeep/database/schema";

export function BucketCard({ recipeTitle, source }: IBucket) {
	return (
		<div className="min-h-22 rounded-xl bg-white text-black border border-gray-400">
			<div className="flex flex-col w-full">
				<div className="flex flex-row">
					<p className="font-semibold pb-2 grow text-sm">{recipeTitle}</p>
				</div>
				<p className="text-xxs pr-1">
					Source: <span className="text-gray-500">{source}</span>
				</p>
			</div>
		</div>
	);
}
