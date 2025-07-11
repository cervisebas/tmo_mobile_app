import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DatabaseTableName } from "../enums/DatabaseTableName";

export const BookStaffModel = sqliteTable(
  DatabaseTableName.BOOK_STAFF,
  {
    id: integer().primaryKey({autoIncrement: true}).notNull(),
    url: text().notNull(),
    name: text().notNull(),
    image: text().notNull(),
    search_name: text().notNull(),
  },
);
