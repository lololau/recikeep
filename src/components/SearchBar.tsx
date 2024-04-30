"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export const SearchBar = () => {
	function handleChangeSearch(e: React.ChangeEvent<HTMLInputElement>) {
		console.log("search text: ", e.target.value);
		setText(e.target.value);
	}

	const [text, setText] = useState("");
	return (
		<div className="flex flex-row gap-2 sm:w-96 w-60">
			<input
				type="text"
				placeholder={""}
				className=" text-gray-400 text-center border gap-2 rounded-xl px-2 w-full"
				value={text}
				onChange={handleChangeSearch}
			/>
			<button type="button" onClick={() => setText("")}>
				<FaSearch color="green" size="20px" />
			</button>
		</div>
	);
};
