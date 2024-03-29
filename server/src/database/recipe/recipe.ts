// Database
import openDb from '../db';
import placeholders from 'named-placeholders';

const unamed = placeholders();

export interface Recipe {
    id: number;
    name: string;
    presentation?: string;
    number_parts: number;
    time_preparation?: string;
    time_cooking?: string;
    user_id: number;
}

export type RequestAddRecipe = {
    name: string;
    presentation?: string;
    number_parts: number;
    time_preparation?: string;
    time_cooking?: string;
};

// SQL request - Add a recipe to user connected database by user's id
// Return : recipe created
export const addRecipe = async (userId: number, req: RequestAddRecipe): Promise<Recipe> => {
    const db = await openDb();

    const ret = await db.run(
        ...unamed(
            `INSERT INTO Recipe (name, presentation, number_parts, time_preparation, time_cooking, user_id) 
        VALUES (:name, :presentation, :number_parts, :time_preparation, :time_cooking, :user_id)`,
            {
                name: req.name,
                presentation: req.presentation,
                number_parts: req.number_parts,
                time_preparation: req.time_preparation,
                time_cooking: req.time_cooking,
                user_id: userId,
            },
        ),
    );

    const recipeId = ret.insertId;

    const recipe = db.get<Recipe>(
        ...unamed(
            `SELECT id, name, presentation, number_parts, time_preparation, time_cooking, user_id FROM Recipe WHERE id=:id`,
            { id: recipeId },
        ),
    );

    return recipe;
};

// SQL request - Get all recipes of connected user by user's id
// Return : list of recipes
export const getAllRecipes = async (userId: number): Promise<Recipe[]> => {
    const db = await openDb();

    const recipes: Recipe[] = await db.all<Recipe>(
        ...unamed(`SELECT name, id FROM Recipe WHERE user_id=:userId`, {
            userId: userId,
        }),
    );

    return recipes;
};

// SQL request - Get a recipe of connected user by user's id and recipe's id
// Return : recipe
export const getRecipeInformations = async (userId: number, recipeId: number): Promise<Recipe> => {
    const db = await openDb();

    const recipe = await db.get<Recipe>(
        ...unamed(
            `SELECT id, name, presentation, number_parts, time_preparation, time_cooking 
            FROM Recipe WHERE user_id=:userId AND id=:id`,
            {
                userId: userId,
                id: recipeId,
            },
        ),
    );

    return recipe;
};

export type RequestUpdateRecipe = {
    name?: string;
    presentation?: string;
    number_parts?: number;
    time_preparation?: string;
    time_cooking?: string;
};

// SQL request - Update a recipe of connected user by user's id and recipe's id
// Return : recipe update
export const updateRecipe = async (userId: number, recipeId: number, req: RequestUpdateRecipe): Promise<Recipe> => {
    const db = await openDb();

    await db.run(
        ...unamed(
            `UPDATE Recipe SET name=:name, presentation=:presentation, number_parts=:number_parts, 
            time_preparation=:time_preparation, time_cooking=:time_cooking WHERE id=:id AND user_id=:user_id`,
            {
                name: req.name,
                presentation: req.presentation,
                number_parts: req.number_parts,
                time_preparation: req.time_preparation,
                time_cooking: req.time_cooking,
                id: recipeId,
                user_id: userId,
            },
        ),
    );

    const recipe = await db.get<Recipe>(
        ...unamed(
            `SELECT id, name, presentation, number_parts, time_preparation, time_cooking, user_id FROM Recipe WHERE id=:id`,
            { id: recipeId },
        ),
    );

    return recipe;
};

// SQL request - Delete a recipe from connected user database by user's id and recipe's id
// Return : list of recipes without the deleted one
export const deleteRecipe = async (userId: number, recipeId: number): Promise<Recipe[]> => {
    const db = await openDb();

    await db.run(
        ...unamed(`DELETE FROM Recipe WHERE id=:id AND user_id=:userId`, {
            id: recipeId,
            userId: userId,
        }),
    );

    const recipes = getAllRecipes(userId);
    return recipes;
};
