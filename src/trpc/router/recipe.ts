import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { authenticationProcedure } from "../trpc";
import { z } from "zod";
import { first } from "radash";
import {
	recipes,
	ingredients as ingredientsTable,
	tags as tagsTable,
	ingredientsToRecipes,
	tagsToRecipes,
} from "recikeep/database/schema";
import { eq, sql } from "drizzle-orm";

const ingredientsSchema = z.object({
	name: z.string(),
	quantity: z.string(),
});

export const recipeRouter = {
	// new recipe (which may include new ingredient and new tag)
	createRecipe: authenticationProcedure
		.input(
			z.object({
				title: z.string(),
				preparation: z.string().optional(),
				portions: z.number(),
				glucides: z.string().optional(),
				ingredients: z.array(ingredientsSchema),
				tags: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { title, preparation, portions, glucides, ingredients, tags } =
				input;

			const tagsList: string[] = [];

			return await ctx.db.transaction(async (tx) => {
				// New recipe created
				const recipe = first(
					await tx
						.insert(recipes)
						.values({
							title,
							preparation,
							portions,
							glucides,
							userId: ctx.user.id,
						})
						.returning(),
				);

				if (recipe == null) {
					tx.rollback();
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Recipe insert but not returning ?",
					});
				}
				tagsList.push(recipe.title);

				// Ingredients part
				for (const el of ingredients) {
					// Get ingredient with its quantity
					const ingredientName = el.name.toLowerCase().trim();
					const quantity = el.quantity;
					tagsList.push(ingredientName);

					// Check if ingredient already exist
					const ingredientAlreadyExist = await tx.query.ingredients.findFirst({
						where: eq(ingredientsTable.name, ingredientName),
					});

					// Create ingredient if not exist
					if (ingredientAlreadyExist == null) {
						const ingredient = first(
							await tx
								.insert(ingredientsTable)
								.values({
									name: ingredientName,
								})
								.returning(),
						);

						if (ingredient == null) {
							tx.rollback();
							throw new TRPCError({
								code: "INTERNAL_SERVER_ERROR",
								message: "Ingredient insert but not returning ?",
							});
						}

						// Link between recipe, ingredient, quantity
						await tx
							.insert(ingredientsToRecipes)
							.values({
								ingredientId: ingredient.id,
								recipeId: recipe.id,
								quantity,
							})
							.onConflictDoNothing()
							.returning();
					} else {
						// Link between recipe, ingredient, quantity
						await tx
							.insert(ingredientsToRecipes)
							.values({
								ingredientId: ingredientAlreadyExist.id,
								recipeId: recipe.id,
								quantity,
							})
							.onConflictDoNothing()
							.returning();
					}
				}

				// Tags part
				if (tags) {
					for (let i = 0; i < tags.length; i++) {
						tagsList.push(tags[i]);
					}
				}

				for (let i = 0; i < tagsList.length; i++) {
					// Get tag name
					const tagName = tagsList[i].toLowerCase().trim();

					// Tag insert :
					const tagAlreadyExist = await tx.query.tags.findFirst({
						where: eq(tagsTable.name, tagName),
					});

					if (tagAlreadyExist == null) {
						const tag = first(
							await tx
								.insert(tagsTable)
								.values({
									name: tagName,
								})
								.onConflictDoNothing()
								.returning(),
						);

						if (tag == null) {
							tx.rollback();
							throw new TRPCError({
								code: "INTERNAL_SERVER_ERROR",
								message: "Tag insert but not returning ?",
							});
						}

						// Create link between recipe, ingredient and quantity
						await tx
							.insert(tagsToRecipes)
							.values({
								tagId: tag.id,
								recipeId: recipe.id,
							})
							.onConflictDoNothing();
					} else {
						// Create link between recipe, ingredient and quantity
						await tx
							.insert(tagsToRecipes)
							.values({
								tagId: tagAlreadyExist.id,
								recipeId: recipe.id,
							})
							.onConflictDoNothing();
					}
				}

				return recipe;
			});
		}),

	// get all recipes
	getRecipesByUserId: authenticationProcedure.query(async ({ ctx }) => {
		const recipesList = await ctx.db.query.recipes.findMany({
			where: eq(recipes.userId, ctx.user.id),
		});

		return recipesList;
	}),

	// TODO: bonne façon du path en query ?
	getRecipeById: authenticationProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const recipe = await ctx.db.query.recipes.findFirst({
				where: eq(recipes.id, input),
			});
			return recipe;
		}),
} satisfies TRPCRouterRecord;
