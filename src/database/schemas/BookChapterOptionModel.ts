import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DatabaseTableName } from "../enums/DatabaseTableName";

export const BookChapterOptionModel = sqliteTable(
  DatabaseTableName.BOOK_CHAPTER_OPTIONS,
  {
    id_chapter: integer().notNull(),
    title: text().notNull(),
    date: integer({mode: 'timestamp'}).notNull(),
    path: text().notNull(),
  },
);