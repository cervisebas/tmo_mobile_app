import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { DatabaseTable } from "../enums/DatabaseTable";

export const BookChapterHistory = sqliteTable(
  DatabaseTable.BOOK_CHAPTER_HISTORY,
  {
    id_chapter: integer().unique().notNull(),
    status: integer({mode: 'boolean'}).notNull(),
  },
);
