import type React from "react";
import { createContext, useContext, useReducer } from "react";
import type { IRecipe } from "recikeep/database/schema";

type Action =
	| { type: "addNewRecipe"; payload: IRecipe }
	| { type: "updateRecipe"; payload: IRecipe[] };
type Dispatch = (action: Action) => void;
type State = { recipes: IRecipe[] };
type GameProviderProps = {
	initialRecipes: IRecipe[];
	children: React.ReactNode;
};

const RecipesStateContext = createContext<
	{ state: State; dispatch: Dispatch } | undefined
>(undefined);

const recipesReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "addNewRecipe": {
			return { recipes: [...state.recipes, action.payload] };
		}
		case "updateRecipe": {
			return { ...state, recipes: action.payload };
		}

		default: {
			console.error(`RecipeContext - action unknown: ${action}`);
			return state;
		}
	}
};

export const RecipeProvider = ({
	children,
	initialRecipes,
}: GameProviderProps) => {
	const [state, dispatch] = useReducer(recipesReducer, {
		recipes: initialRecipes,
	});
	return (
		<RecipesStateContext.Provider value={{ state, dispatch }}>
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
