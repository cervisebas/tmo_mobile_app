CREATE TABLE `book-chapters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_bookinfo` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `book-chapters-options` (
	`id_chapter` integer NOT NULL,
	`title` text NOT NULL,
	`date` integer NOT NULL,
	`path` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `book-gender-by-book-info` (
	`id_bookinfo` integer NOT NULL,
	`id_bookgender` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `book-genders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`path` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `books-info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`url` text NOT NULL,
	`title` text NOT NULL,
	`picture` text NOT NULL,
	`stars` numeric NOT NULL,
	`type` text NOT NULL,
	`status` text,
	`subtitle` text,
	`description` text,
	`wallpaper` text
);
