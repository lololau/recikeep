import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

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

export const ingredients = sqliteTable("ingredients", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$default(() => createId()),
	name: text("name").unique().notNull(),
	quantity: text("quantity").unique().notNull(),
});

export const tags = sqliteTable("tags", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$default(() => createId()),
	name: text("name").unique().notNull(),
});

export const recipes = sqliteTable("recipes", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text("title").unique().notNull(),
	preparation: text("preparation"),
	portions: integer("portions").notNull(),
	glucides: integer("glucides"),
});

export const ingredientsToRecipes = sqliteTable("ingredientsToRecipes", {
	ingredients: text("ingredient_id")
		.notNull()
		.references(() => ingredients.id),
	recipeId: text("recipe_id")
		.notNull()
		.references(() => recipes.id),
});

export const tagsToRecipes = sqliteTable("tagsToRecipes", {
	tags: text("tag_id")
		.notNull()
		.references(() => tags.id),
	recipeId: text("recipe_id")
		.notNull()
		.references(() => recipes.id),
});
