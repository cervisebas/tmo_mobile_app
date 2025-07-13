import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { DatabaseTableName } from "../enums/DatabaseTableName";

export const BookGenderByBookInfoModel = sqliteTable(
  DatabaseTableName.BOOK_GENDER_BY_BOOK_INFO,
  {
    id_bookinfo: integer().notNull(),
    id_bookgender: integer().notNull(),
  },
  (table) => ({
    unique_book_gender: unique().on(
      table.id_bookinfo,
      table.id_bookgender,
    ),
  })
);
