"use client";

import type React from "react";
import { createContext, useContext } from "react";
import type { RecipesFormated } from "recikeep/trpc/router/recipe";

type RecipeProviderProps = {
	recipes: RecipesFormated[];
	children: React.ReactNode;
};

// Create a context for recipes, initially undefined
const RecipesStateContext = createContext<
	{ recipes: RecipesFormated[] } | undefined
>(undefined);

// RecipeProvider component that provides recipes data to its children
export const RecipesProvider = ({ children, recipes }: RecipeProviderProps) => {
	return (
		<RecipesStateContext.Provider value={{ recipes }}>
			{children}
		</RecipesStateContext.Provider>
	);
};

// Custom useRecipes hook to consume the recipes context
export const useRecipes = () => {
	const context = useContext(RecipesStateContext);
	if (context === undefined) {
		throw new Error("useRecipes must be used within a RecipeProvider");
	}
	// Return the context value (recipes data)
	return context;
};
