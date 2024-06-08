"use client";

import { FaSearch } from "react-icons/fa";
import Fuse from "fuse.js";
import type React from "react";
import { useState } from "react";
import { useRecipes } from "recikeep/contexts/RecipesContext";

export const SearchBar = ({
	handleSearchChange,
}: {
	handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	return (
		<div className="flex flex-row gap-2 w-3/5">
			<input
				type="text"
				placeholder={"Quelle recette veux-tu cuisiner ?"}
				className=" text-sm border-2 gap-2 rounded-3xl px-3 py-2 w-full"
				onChange={handleSearchChange}
			/>
			<button type="button">
				<FaSearch color="#065f46" size="20px" />
			</button>
		</div>
	);
};
