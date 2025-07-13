import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { DatabaseTableName } from "../enums/DatabaseTableName";

export const BookChapterModel = sqliteTable(
  DatabaseTableName.BOOK_CHAPTERS,
  {
    id: integer().primaryKey({autoIncrement: true}).notNull(),
    id_bookinfo: integer().notNull(),
    name: text().notNull(),
    data_chapter: integer().notNull().default(0),
  },
  (table) => ({
    unique_book_chapter: unique().on(
      table.id_bookinfo,
      table.data_chapter,
    ),
  }),
);