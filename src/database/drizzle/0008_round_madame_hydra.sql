CREATE TABLE `bucket` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_title` text NOT NULL,
	`source` text NOT NULL,
	`recipe_id` text,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON UPDATE no action ON DELETE no action
);
