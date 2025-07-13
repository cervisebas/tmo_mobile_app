CREATE UNIQUE INDEX `book-chapters_id_bookinfo_data_chapter_unique` ON `book-chapters` (`id_bookinfo`,`data_chapter`);--> statement-breakpoint
CREATE UNIQUE INDEX `book-chapters-options_id_chapter_path_unique` ON `book-chapters-options` (`id_chapter`,`path`);--> statement-breakpoint
CREATE UNIQUE INDEX `book-gender-by-book-info_id_bookinfo_id_bookgender_unique` ON `book-gender-by-book-info` (`id_bookinfo`,`id_bookgender`);--> statement-breakpoint
CREATE UNIQUE INDEX `book-genders_value_unique` ON `book-genders` (`value`);--> statement-breakpoint
CREATE UNIQUE INDEX `books-info_url_unique` ON `books-info` (`url`);--> statement-breakpoint
CREATE UNIQUE INDEX `book-user-status-by-book-info_id_bookinfo_status_unique` ON `book-user-status-by-book-info` (`id_bookinfo`,`status`);