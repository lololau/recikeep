import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const users = sqliteTable("user", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	email: text("email").unique().notNull(),
	password: text("password").notNull(),
});

export const sessions = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: integer("expires_at").notNull(),
});

export const ingredients = sqliteTable("ingredient", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$default(() => createId()),
	name: text("name").unique().notNull(),
});

export const tags = sqliteTable("tag", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$default(() => createId()),
	name: text("name").unique().notNull(),
});

export const recipes = sqliteTable("recipe", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text("title").notNull(),
	preparation: text("preparation"),
	source: text("source"),
	description: text("description"),
	portions: integer("portions").notNull(),
	glucides: text("glucides"),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
});

export const buckets = sqliteTable("bucket", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	recipeTitle: text("recipe_title").notNull(),
	source: text("source").notNull(),
	recipeId: text("recipe_id").references(() => recipes.id),
	userId: text("user_id").references(() => users.id),
});

export type IRecipe = typeof recipes.$inferInsert;

export type IBucket = typeof buckets.$inferInsert;

export const ingredientsToRecipes = sqliteTable(
	"ingredients_to_recipes",
	{
		ingredientId: text("ingredient_id")
			.notNull()
			.references(() => ingredients.id),
		recipeId: text("recipe_id")
			.notNull()
			.references(() => recipes.id),
		quantity: text("quantity").notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.ingredientId, table.recipeId] }),
	}),
);

export const tagsToRecipes = sqliteTable(
	"tags_to_recipes",
	{
		tagId: text("tag_id")
			.notNull()
			.references(() => tags.id),
		recipeId: text("recipe_id")
			.notNull()
			.references(() => recipes.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.tagId, table.recipeId] }),
	}),
);

export const userRelations = relations(users, ({ many }) => ({
	recipes: many(recipes),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
	user: one(users, {
		fields: [recipes.userId],
		references: [users.id],
	}),
	ingredientsToRecipes: many(ingredientsToRecipes),
	tagsToRecipes: many(tagsToRecipes),
}));

export const bucketsRelations = relations(buckets, ({ one }) => ({
	recipe: one(recipes, {
		fields: [buckets.recipeId],
		references: [recipes.id],
	}),
	user: one(users, {
		fields: [buckets.userId],
		references: [users.id],
	}),
}));

export const tagsToRecipesRelations = relations(tagsToRecipes, ({ one }) => ({
	tag: one(tags, {
		fields: [tagsToRecipes.tagId],
		references: [tags.id],
	}),
	recipe: one(recipes, {
		fields: [tagsToRecipes.recipeId],
		references: [recipes.id],
	}),
}));

export const ingredientsToRecipesRelations = relations(
	ingredientsToRecipes,
	({ one }) => ({
		ingredient: one(ingredients, {
			fields: [ingredientsToRecipes.ingredientId],
			references: [ingredients.id],
		}),
		recipe: one(recipes, {
			fields: [ingredientsToRecipes.recipeId],
			references: [recipes.id],
		}),
	}),
);
