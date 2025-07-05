PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_book-genders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_book-genders`("id", "name", "value") SELECT "id", "name", "value" FROM `book-genders`;--> statement-breakpoint
DROP TABLE `book-genders`;--> statement-breakpoint
ALTER TABLE `__new_book-genders` RENAME TO `book-genders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;