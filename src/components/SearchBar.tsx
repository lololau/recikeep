import { FaSearch } from "react-icons/fa";
import { api } from "recikeep/trpc/server";

export const SearchBar = async () => {
	await api.recipes.getRecipesBySearch("");
	return (
		<div className="flex flex-row gap-2 w-3/5">
			<input
				type="text"
				placeholder={"Quelle recette veux-tu cuisiner ?"}
				className=" text-sm border-2 gap-2 rounded-3xl px-3 py-2 w-full"
			/>
			<button type="button">
				<FaSearch color="#065f46" size="20px" />
			</button>
		</div>
	);
};
