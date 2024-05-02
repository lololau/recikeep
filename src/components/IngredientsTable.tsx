import { MdDeleteOutline } from "react-icons/md";

interface IIngredients {
	name: string;
	quantity: string;
}
[];

export const IngredientsTable = ({
	ingredients,
	remove,
}: {
	ingredients: { name: string; quantity: string }[];
	remove: (index: number) => IIngredients;
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
							<td className="px-6 py-4 whitespace-nowrap text-end font-medium">
								<button
									onClick={() => {
										remove(index);
									}}
									type="button"
									className="inline-flex items-center gap-x-2 font-semibold rounded-lg border border-transparent text-green-600 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none"
								>
									<MdDeleteOutline />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
