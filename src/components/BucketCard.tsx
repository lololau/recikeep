import { IoIosAddCircle } from "react-icons/io";
import type { IBucket } from "recikeep/database/schema";

export function BucketCard({
	recipeTitle,
	source,
}: { recipeTitle: string; source: string }) {
	return (
		<>
			<div className="text-left font-light text-gray-800">
				<p>{recipeTitle}</p>
				<p className="text-left font-base text-gray-500 text-xs ">
					Reference: {source}
				</p>
			</div>
		</>
	);
}
