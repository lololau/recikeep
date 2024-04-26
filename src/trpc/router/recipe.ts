import type { TRPCRouterRecord } from "@trpc/server";
import { authenticationProcedure } from "../trpc";
import { z } from "zod";
import {
	recipes,
	ingredients as ingredientsTable,
	tags as tagsTable,
	ingredientsToRecipes,
	tagsToRecipes,
} from "recikeep/database/schema";
import { eq } from "drizzle-orm";

const ingredientsSchema = z.object({
	name: z.string(),
	quantity: z.string(),
});

const tagsSchema = z.object({
	name: z.string(),
});

export const recipeRouter = {
	// new recipe (which may include new ingredient and new tag)
	createRecipe: authenticationProcedure
		.input(
			z.object({
				title: z.string(),
				preparation: z.string(),
				portions: z.number(),
				glucides: z.string(),
				ingredients: z.array(ingredientsSchema),
				tags: z.array(tagsSchema),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { title, preparation, portions, glucides, ingredients, tags } =
				input;

			// New recipe created
			const recipe = await ctx.db
				.insert(recipes)
				.values({ title, preparation, portions, glucides, userId: ctx.user.id })
				.returning();

			// Ingredients part
			for (let i = 0; i < ingredients.length; i++) {
				// Get ingredient with its quantity
				const ingredientName = ingredients[i].name.toLowerCase().trim();
				const quantity = ingredients[i].quantity;

				// Check if ingredient already exist in db
				const ingredientAlreadyInTable =
					await ctx.db.query.ingredients.findFirst({
						where: eq(ingredientsTable.name, ingredientName),
					});

				// Already exist :
				// Create link between recipe, ingredient and quantity
				if (ingredientAlreadyInTable !== undefined) {
					await ctx.db.insert(ingredientsToRecipes).values({
						ingredientId: ingredientAlreadyInTable.id,
						recipeId: recipe[0].id,
						quantity,
					});
				}

				// Ingredient not exist :
				// New ingredient into table
				const ingredient = await ctx.db
					.insert(ingredientsTable)
					.values({
						name: ingredientName,
					})
					.returning();

				// Create link between recipe, ingredient and quantity
				await ctx.db.insert(ingredientsToRecipes).values({
					ingredientId: ingredient[0].id,
					recipeId: recipe[0].id,
					quantity,
				});
			}

			// Tags part
			for (let i = 0; i < tags.length; i++) {
				// Get ingredient with its quantity
				const tagName = tags[i].name.toLowerCase().trim();

				// Check if ingredient already exist in db
				const tagAlreadyInTable = await ctx.db.query.tags.findFirst({
					where: eq(tagsTable.name, tagName),
				});

				// Already exist :
				// Create link between recipe and tag
				if (tagAlreadyInTable !== undefined) {
					await ctx.db.insert(tagsToRecipes).values({
						tagId: tagAlreadyInTable.id,
						recipeId: recipe[0].id,
					});
				}

				// Tag not exist :
				// New tag into table
				const tag = await ctx.db
					.insert(tagsTable)
					.values({
						name: tagName,
					})
					.returning();

				// Create link between recipe, ingredient and quantity
				await ctx.db.insert(tagsToRecipes).values({
					tagId: tag[0].id,
					recipeId: recipe[0].id,
				});
			}

			return recipe[0];
		}),

	// get all recipes
	getRecipesByUserId: authenticationProcedure.query(async ({ ctx }) => {
		const recipesList = await ctx.db.query.recipes.findMany({
			where: eq(recipes.userId, ctx.user.id),
		});

		return recipesList;
	}),

	// TODO: comment passer un argument du path en query ? mutation ? comment le donner via le front ?
	// getRecipeById: authenticationProcedure.query(async ({ ctx, input }) => {
	// 	const recipe = await ctx.db.query.recipes.findFirst({
	// 		where: eq(recipes.id, input.)
	// 	})
	// })
} satisfies TRPCRouterRecord;
