// IngredientsTable components takes a list of ingredient with a name and a quantity
export const IngredientsTable = ({
	ingredients,
}: {
	ingredients: { name: string; quantity: string }[];
}) => {
	return (
		<ul className="gap-4 sm:px-0">
			{ingredients.map((ingredient, index) => (
				<li key={`${ingredient.name}—${index}`} className="flex gap-1">
					<p className="text-gray-700 col-span-1 font-semibold">
						• {ingredient.name} :
					</p>
					<p className="text-gray-700 col-span-1">{ingredient.quantity}</p>
				</li>
			))}
		</ul>
	);
};
