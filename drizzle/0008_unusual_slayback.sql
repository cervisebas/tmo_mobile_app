CREATE TABLE `book-user-chapter-book-history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_bookinfo` integer NOT NULL,
	`id_chapter` integer NOT NULL,
	`path_option` text NOT NULL,
	`progress` numeric NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book-user-chapter-book-history_id_bookinfo_unique` ON `book-user-chapter-book-history` (`id_bookinfo`);