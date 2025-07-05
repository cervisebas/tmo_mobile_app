import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DatabaseTable } from "../enums/DatabaseTable";

export const BookGenderModel = sqliteTable(
  DatabaseTable.BOOK_GENDERS,
  {
    id: integer().primaryKey({autoIncrement: true}).notNull(),
    name: text().notNull(),
    value: integer().notNull(),
  },
);
