CREATE TABLE `recipesToUsers` (
	`user_id` text NOT NULL,
	`recipe_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP INDEX IF EXISTS `ingredient_quantity_unique`;--> statement-breakpoint
ALTER TABLE ingredientsToRecipes ADD `quantity` text NOT NULL;--> statement-breakpoint
ALTER TABLE `ingredient` DROP COLUMN `quantity`;