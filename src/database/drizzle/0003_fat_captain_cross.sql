ALTER TABLE `ingredients` RENAME TO `ingredient`;--> statement-breakpoint
ALTER TABLE `recipes` RENAME TO `recipe`;--> statement-breakpoint
ALTER TABLE `tags` RENAME TO `tag`;--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
DROP INDEX IF EXISTS `ingredients_name_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `ingredients_quantity_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `recipes_title_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `tags_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `ingredient_name_unique` ON `ingredient` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `ingredient_quantity_unique` ON `ingredient` (`quantity`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipe_title_unique` ON `recipe` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `tag_name_unique` ON `tag` (`name`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/