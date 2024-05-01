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
import { eq } from "drizzle-orm";

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
				tags: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { title, preparation, portions, glucides, ingredients, tags } =
				input;

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

				// Ingredients part
				for (const el of ingredients) {
					// Get ingredient with its quantity
					const ingredientName = el.name.toLowerCase().trim();
					const quantity = el.quantity;

					// Create ingredient if not exist or do nothing if already exist
					const ingredient = first(
						await tx
							.insert(ingredientsTable)
							.values({
								name: ingredientName,
							})
							.onConflictDoNothing()
							.returning(),
					);

					if (ingredient == null) {
						tx.rollback();
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: "Ingredient insert but not returning ?",
						});
					}

					// Create link between recipe, ingredient and quantity
					await tx
						.insert(ingredientsToRecipes)
						.values({
							ingredientId: ingredient.id,
							recipeId: recipe.id,
							quantity,
						})
						.onConflictDoNothing();
				}

				// Tags part
				for (const el in tags) {
					// Get ingredient with its quantity
					const tagName = el.toLowerCase().trim();

					// Tag insert :
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
