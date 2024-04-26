export const IngredientsTable = ({
	name,
	quantity,
}: { name: string; quantity: string }) => {
	return (
		<>
			<table className="border-collapse border border-slate-400 table-auto font-normal w-full">
				<tbody>
					<tr>
						<td className="border border-slate-300">{name}</td>
						<td className="border border-slate-300">{quantity}</td>
					</tr>
				</tbody>
			</table>
		</>
	);
};
