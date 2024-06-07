import type React from "react";
import { createContext, useContext, useReducer } from "react";
import type { RecipesFormated } from "recikeep/trpc/router/recipe";

type State = { recipes: RecipesFormated[] };
type GameProviderProps = {
	initialRecipes: RecipesFormated[];
	children: React.ReactNode;
};

const RecipesStateContext = createContext<{ state: State } | undefined>(
	undefined,
);

const recipesReducer = (state: State): State => {
	return state;
};

export const RecipeProvider = ({
	children,
	initialRecipes,
}: GameProviderProps) => {
	const [state] = useReducer(recipesReducer, {
		recipes: initialRecipes,
	});
	return (
		<RecipesStateContext.Provider value={{ state }}>
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
