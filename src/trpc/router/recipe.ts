import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { authenticationProcedure, isAuthentified, t } from "../trpc";
import { z } from "zod";
import { first } from "radash";
import {
	recipes,
	ingredients as ingredientsTable,
	tags as tagsTable,
	ingredientsToRecipes,
	tagsToRecipes,
	buckets,
	type IRecipe,
} from "recikeep/database/schema";
import { eq } from "drizzle-orm";

const ingredientsSchema = z.object({
	name: z.string(),
	quantity: z.string(),
});

const loadUsersRecipes = isAuthentified.unstable_pipe(async ({ ctx, next }) => {
	const recipesList = await ctx.db.query.recipes.findMany({
		where: eq(recipes.userId, ctx.user.id),
	});
	return next({ ctx: { recipesList } });
});

export const recipeRouter = {
	// new recipe (which may include new ingredient and new tag)
	createRecipe: authenticationProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string().optional(),
				preparation: z.string().optional(),
				source: z.string(),
				portions: z.number(),
				glucides: z.string().optional(),
				ingredients: z.array(ingredientsSchema),
				tags: z.array(z.string()).optional(),
				bucketId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const {
				title,
				description,
				preparation,
				source,
				portions,
				glucides,
				ingredients,
				tags,
				bucketId,
			} = input;

			return await ctx.db.transaction(async (tx) => {
				// New recipe created
				const recipe = first(
					await tx
						.insert(recipes)
						.values({
							title,
							description,
							preparation,
							source,
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

				if (bucketId) {
					const bucket = await tx
						.update(buckets)
						.set({ recipeId: recipe.id })
						.where(eq(buckets.id, bucketId));

					if (bucket == null) {
						tx.rollback();
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: `Bucket not find by id: ${bucketId}`,
						});
					}
				}

				// Ingredients part
				for (const el of ingredients) {
					// Get ingredient with its quantity
					const ingredientName = el.name.toLowerCase().trim();
					const quantity = el.quantity;

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

				const tagsList: string[] = [];
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

	// get recipe by recipeId
	getRecipeById: authenticationProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const recipe = await ctx.db.query.recipes.findFirst({
				where: eq(recipes.id, input),
			});
			return recipe;
		}),

	// get ingredients by recipeId
	getIngredientsByRecipeId: authenticationProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const ingredientsByRecipeId =
				await ctx.db.query.ingredientsToRecipes.findMany({
					where: eq(ingredientsToRecipes.recipeId, input),
				});
			const ingredientsList = [];
			for (const el of ingredientsByRecipeId) {
				const ingr = await ctx.db.query.ingredients.findFirst({
					where: eq(ingredientsTable.id, el.ingredientId),
				});

				if (ingr == null) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Ingredient in db with no name ??",
					});
				}

				const ingredient = { ...el, name: ingr.name };
				ingredientsList.push(ingredient);
			}
			return ingredientsList;
		}),
	// get tags by recipeId
	getTagsByRecipeId: authenticationProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const tagsByRecipeId = await ctx.db.query.tagsToRecipes.findMany({
				where: eq(tagsToRecipes.recipeId, input),
			});
			const tagsList = [];
			for (const el of tagsByRecipeId) {
				const tag = await ctx.db.query.tags.findFirst({
					where: eq(tagsTable.id, el.tagId),
				});

				if (tag == null) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Tag in db with no name ??",
					});
				}

				const tagToReturn = { ...el, name: tag.name };
				tagsList.push(tagToReturn);
			}
			return tagsList;
		}),
	// get recipes by search
	getRecipesBySearch: authenticationProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			// Get recipes by user
			const recipesByUser = await ctx.db.query.recipes.findMany({
				where: eq(recipes.userId, ctx.user.id),
				with: {
					ingredientsToRecipes: {
						with: {
							ingredient: true,
						},
					},
					tagsToRecipes: {
						with: {
							tag: true,
						},
					},
				},
			});

			console.log("result === ", JSON.stringify(recipesByUser, null, 2));
		}),
} satisfies TRPCRouterRecord;
