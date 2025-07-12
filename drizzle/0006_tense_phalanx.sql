CREATE TABLE `book-staff-by-book-info` (
	`id_bookinfo` integer NOT NULL,
	`id_bookstaff` integer NOT NULL,
	`position` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book-staff-by-book-info_id_bookinfo_id_bookstaff_position_unique` ON `book-staff-by-book-info` (`id_bookinfo`,`id_bookstaff`,`position`);--> statement-breakpoint
CREATE TABLE `book-staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`name` text NOT NULL,
	`image` text NOT NULL,
	`search_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book-staff_url_unique` ON `book-staff` (`url`);