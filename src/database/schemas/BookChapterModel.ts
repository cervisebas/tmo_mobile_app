import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DatabaseTable } from "../enums/DatabaseTable";

export const BookChapterModel = sqliteTable(
  DatabaseTable.BOOK_CHAPTERS,
  {
    id: integer().primaryKey({autoIncrement: true}).notNull(),
    id_bookinfo: integer().notNull(),
    name: text().notNull(),
  },
);