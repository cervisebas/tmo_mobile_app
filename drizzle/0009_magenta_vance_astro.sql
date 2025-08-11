CREATE TABLE `book-user-chapter-history-model` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_bookinfo` integer NOT NULL,
	`id_chapter` integer NOT NULL,
	`date` integer NOT NULL
);
