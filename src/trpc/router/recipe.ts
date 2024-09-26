import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { eq } from "drizzle-orm";
import { first } from "radash";
import {
	buckets,
	ingredients as ingredientsTable,
	ingredientsToRecipes,
	recipes,
	tags as tagsTable,
	tagsToRecipes,
} from "recikeep/database/schema";
import { z } from "zod";
import { authenticationProcedure, publicProcedure } from "../trpc";

const ingredientsSchema = z.object({
	name: z.string(),
	quantity: z.string(),
});

export type RecipesFormated = {
	id: string;
	title: string;
	preparation: string | null;
	main_image: string | null;
	source: string;
	description: string | null;
	portions: number;
	glucides: string | null;
	ingredients: { id: string; quantity: string; name: string }[];
	tags: { id: string; name: string }[];
	filters?: string[];
};

export const recipeRouter = {
	// new recipe (which may include new ingredient and new tag)
	createRecipe: authenticationProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string().nullable(),
				preparation: z.string().nullable(),
				source: z.string(),
				portions: z.number(),
				glucides: z.string().nullable(),
				ingredients: z.array(ingredientsSchema),
				tags: z.array(z.string()).optional(),
				bucketId: z.string().optional(),
				imageUrl: z.string().nullable(),
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
				imageUrl,
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
							main_image: imageUrl,
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
					const ingredientName = (
						el.name[0].toUpperCase() + el.name.slice(1).toLowerCase()
					).trim();
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

	// update recipe
	updateRecipe: authenticationProcedure
		.input(
			z.object({
				recipeId: z.string().optional(),
				title: z.string(),
				description: z.string().nullable(),
				preparation: z.string().nullable(),
				source: z.string(),
				portions: z.number(),
				glucides: z.string().nullable(),
				ingredients: z.array(ingredientsSchema),
				tags: z.array(z.string()).optional(),
				imageUrl: z.string().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const {
				recipeId,
				title,
				description,
				preparation,
				source,
				portions,
				glucides,
				ingredients,
				tags,
				imageUrl,
			} = input;

			if (!recipeId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "missing recipeId",
				});
			}

			return await ctx.db.transaction(async (tx) => {
				// Get recipe by id
				const recipeFound = first(
					await tx
						.update(recipes)
						.set({
							title,
							description,
							preparation,
							source,
							portions,
							glucides,
							main_image: imageUrl,
						})
						.where(eq(recipes.id, recipeId))
						.returning(),
				);

				if (recipeFound == null) {
					tx.rollback();
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "recipe not found by id",
					});
				}

				// Ingredients part
				// Delete all ingredients already linked with recipeId
				await tx
					.delete(ingredientsToRecipes)
					.where(eq(ingredientsToRecipes.recipeId, recipeId));

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
								recipeId: recipeFound.id,
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
								recipeId: recipeFound.id,
								quantity,
							})
							.onConflictDoNothing()
							.returning();
					}
				}

				const tagsList: string[] = [];
				// Tags part
				// Delete all tags already linked with recipeId
				await tx
					.delete(tagsToRecipes)
					.where(eq(tagsToRecipes.recipeId, recipeId));

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

						// Create link between recipe and tag
						await tx
							.insert(tagsToRecipes)
							.values({
								tagId: tag.id,
								recipeId: recipeFound.id,
							})
							.onConflictDoNothing();
					} else {
						// Create link between recipe, recipe and quantity
						await tx
							.insert(tagsToRecipes)
							.values({
								tagId: tagAlreadyExist.id,
								recipeId: recipeFound.id,
							})
							.onConflictDoNothing()
							.returning();
					}
				}

				return recipeFound;
			});
		}),

	// get all recipes
	getRecipesByUserId: authenticationProcedure.query(async ({ ctx }) => {
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

		return recipesByUser.map((recipe) => {
			const recipeFormated: RecipesFormated = {
				id: recipe.id,
				title: recipe.title,
				preparation: recipe.preparation,
				main_image: recipe.main_image,
				source: recipe.source,
				description: recipe.description,
				portions: recipe.portions,
				glucides: recipe.glucides,
				ingredients: [],
				tags: [],
			};

			for (const ingredient of recipe.ingredientsToRecipes) {
				const ingredientFormated = {
					id: ingredient.ingredientId,
					quantity: ingredient.quantity,
					name: ingredient.ingredient.name,
				};

				recipeFormated.ingredients.push(ingredientFormated);
			}

			for (const tag of recipe.tagsToRecipes) {
				const tagFormated = {
					id: tag.tagId,
					name: tag.tag.name,
				};

				recipeFormated.tags.push(tagFormated);
			}
			return recipeFormated;
		});
	}),

	getRecipeById: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const recipe = await ctx.db.query.recipes.findFirst({
				where: eq(recipes.id, input),
			});
			return recipe;
		}),

	deleteImageRecipeByKey: authenticationProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			const utapi = new UTApi();
			try {
				await utapi.deleteFiles(input);
			} catch (error) {
				console.error("UTAPI: Error deleting files", error);
			}
		}),

	// get ingredients by recipeId
	getIngredientsByRecipeId: publicProcedure
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
	getTagsByRecipeId: publicProcedure
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
		}),
} satisfies TRPCRouterRecord;
