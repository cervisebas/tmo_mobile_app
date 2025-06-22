import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { DatabaseTable } from "../enums/DatabaseTable";

export const BookGenderByBookInfo = sqliteTable(
  DatabaseTable.BOOK_GENDER_BY_BOOK_INFO,
  {
    id_bookinfo: integer().notNull(),
    id_bookgender: integer().notNull(),
  },
);
