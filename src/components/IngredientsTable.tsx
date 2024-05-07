import { MdDeleteOutline } from "react-icons/md";

interface IIngredients {
	name: string;
	quantity: string;
}
[];

export const IngredientsTable = ({
	ingredients,
}: {
	ingredients: { name: string; quantity: string }[];
}) => {
	return (
		<div className="border border-slate-300 rounded-lg overflow-hidden">
			<table className="min-w-full divide-y divide-gray-200">
				<tbody className="divide-y divide-gray-200">
					{ingredients.map((ingredient, index) => (
						<tr key={`${ingredient.name}_${index}`}>
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
								{ingredient.name}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
								{ingredient.quantity}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
