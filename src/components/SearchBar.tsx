"use client";

import type React from "react";

export const SearchBar = ({
	handleSearchChange,
}: {
	handleSearchChange: (query: string) => void;
}) => {
	return (
		<div className="flex flex-row gap-2 w-5/6 sm:w-4/5">
			<input
				type="text"
				placeholder={"Quelle recette veux-tu cuisiner ?"}
				className="text-sm sm:text-base text-center border-2 gap-2 rounded-3xl px-3 py-2 w-full"
				onChange={(e) => handleSearchChange(e.target.value)}
			/>
		</div>
	);
};
