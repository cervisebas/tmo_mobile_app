import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { DatabaseTableName } from "../enums/DatabaseTableName";

export const BookChapterOptionModel = sqliteTable(
  DatabaseTableName.BOOK_CHAPTER_OPTIONS,
  {
    id_chapter: integer().notNull(),
    title: text().notNull(),
    date: integer({mode: 'timestamp'}).notNull(),
    path: text().notNull(),
  },
  (table) => ({
    unique_chapter_option: unique().on(
      table.id_chapter,
      table.path,
    ),
  }),
);