import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DatabaseTable } from "../enums/DatabaseTable";
import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";

export const BookUserStatusByBookInfo = sqliteTable(
  DatabaseTable.BOOK_USER_STATUS_BY_BOOK_INFO,
  {
    id_bookinfo: integer().notNull(),
    status: text().notNull().$type<keyof UserBookStatusList>(),
    value: text().notNull(),
    marked: integer({ mode: 'boolean' }).$type<boolean>(),
  },
);
