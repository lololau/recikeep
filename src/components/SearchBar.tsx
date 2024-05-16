"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export const SearchBar = () => {
	function handleChangeSearch(e: React.ChangeEvent<HTMLInputElement>) {
		setText(e.target.value);
	}

	const [text, setText] = useState("");
	return (
		<div className="flex flex-row gap-2 w-3/5">
			<input
				type="text"
				placeholder={"Quelle recette veux-tu cuisiner ?"}
				className=" text-sm border-2 gap-2 rounded-3xl px-3 py-2 w-full"
				value={text}
				onChange={handleChangeSearch}
			/>
			<button type="button" onClick={() => setText("")}>
				<FaSearch color="#065f46" size="20px" />
			</button>
		</div>
	);
};
