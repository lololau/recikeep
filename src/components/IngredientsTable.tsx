export const IngredientsTable = ({
	ingredients,
}: {
	ingredients: { name: string; quantity: string }[];
}) => {
	return (
		<ul className="list-disc">
			{ingredients.map((ingredient, index) => (
				<li
					key={`${ingredient.name}—${index}`}
					className="grid grid-cols-9 gap-4"
				>
					<div className="font-medium text-gray-800 col-span-1">
						- {ingredient.name}
					</div>
					<div className="col-span-1">{ingredient.quantity}</div>
				</li>
			))}
		</ul>
	);
};
