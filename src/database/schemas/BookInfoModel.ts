import { integer, numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DatabaseTableName } from "../enums/DatabaseTableName";
import { BookStatus } from "~/api/enums/BookStatus";
import { BookType } from "~/api/enums/BookType";

export const BookInfoModel = sqliteTable(
  DatabaseTableName.BOOKS_INFO,
  {
    id: integer().primaryKey({autoIncrement: true}).notNull(),
    path: text().notNull(),
    url: text().notNull().unique(),
    title: text().notNull(),
    picture: text().notNull(),
    stars: numeric().notNull().$type<number>(),
    type: text().$type<BookType>().notNull(),

    status: text().$type<BookStatus>(),
    subtitle: text(),
    description: text(),
    wallpaper: text(),
  },
);

/*
genders: GenderInfo[];
chapters: ChapterInfo[];

user_status: BookStatusUser;
*/
