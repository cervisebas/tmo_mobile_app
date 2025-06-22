import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DatabaseTable } from "../enums/DatabaseTable";

export const BookChapterOptionModel = sqliteTable(
  DatabaseTable.BOOK_CHAPTER_OPTIONS,
  {
    id_chapter: integer().notNull(),
    title: text().notNull(),
    date: integer({mode: 'timestamp'}).notNull(),
    path: text().notNull(),
  },
);