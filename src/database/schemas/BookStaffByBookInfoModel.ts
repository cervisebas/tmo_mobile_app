import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { DatabaseTableName } from "../enums/DatabaseTableName";

export const BookStaffByBookInfoModel = sqliteTable(
  DatabaseTableName.BOOK_STAFF_BY_BOOKS_INFO,
  {
    id_bookinfo: integer().notNull(),
    id_bookstaff: integer().notNull(),
    position: text().notNull(),
  },
  (table) => ({
    unique_all: unique().on(
      table.id_bookinfo,
      table.id_bookstaff,
      table.position,
    ),
  }),
);
