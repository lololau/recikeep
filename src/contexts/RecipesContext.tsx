import type React from "react";
import { createContext, useContext, useReducer } from "react";
import type { RecipesFormated } from "recikeep/trpc/router/recipe";

type RecipeProviderProps = {
	recipes: RecipesFormated[];
	children: React.ReactNode;
};

const RecipesStateContext = createContext<
	{ recipes: RecipesFormated[] } | undefined
>(undefined);

export const RecipesProvider = ({ children, recipes }: RecipeProviderProps) => {
	return (
		<RecipesStateContext.Provider value={{ recipes }}>
			{children}
		</RecipesStateContext.Provider>
	);
};

export const useRecipes = () => {
	const context = useContext(RecipesStateContext);
	if (context === undefined) {
		throw new Error("useRecipes must be used within a RecipeProvider");
	}
	return context;
};
