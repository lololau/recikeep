export const IngredientsTable = ({
	ingredients,
}: {
	ingredients: { name: string; quantity: string }[];
}) => {
	return (
		<ul className="list-disc grid grid-cols-3 gap-4 sm:px-10 sm:grid-cols-7 sm:col">
			{ingredients.map((ingredient, index) => (
				<li
					key={`${ingredient.name}—${index}`}
					className="flex flex-col gap-1 sm:gap-2 text-center"
				>
					<p className="text-gray-700 col-span-1">{ingredient.name}</p>
					<p className="text-gray-700 col-span-1">{ingredient.quantity}</p>
				</li>
			))}
		</ul>
	);
};
