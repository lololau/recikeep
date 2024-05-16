import { IoIosAddCircle } from "react-icons/io";
import type { IBucket } from "recikeep/database/schema";

export function BucketCard({
	recipeTitle,
	source,
}: { recipeTitle: string; source: string }) {
	return (
		<>
			<div className="font-light text-gray-800 text-start px-2 grid flex-grow">
				<p>{recipeTitle}</p>
				<p className="font-base text-gray-500 text-xs">Reference: {source}</p>
			</div>
			<div>
				<button
					type="button"
					className="text-xl font-semibold text-emerald-600 hover:text-emerald-800 disabled:opacity-50 disabled:pointer-events-none"
				>
					<IoIosAddCircle color="#065f46" />
				</button>
			</div>
		</>
	);
}
