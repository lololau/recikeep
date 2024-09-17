// Card component with recipeTitle, source and onClick function as props
export function BucketCard({
	recipeTitle,
	source,
	onClick,
}: { recipeTitle: string; source: string; onClick: () => void }) {
	return (
		<button type="button" onClick={onClick}>
			<div className="text-left font-light text-gray-800">
				<p>{recipeTitle}</p>
				<p className="text-left font-base text-gray-500 text-xs ">
					Reference: {source}
				</p>
			</div>
		</button>
	);
}
