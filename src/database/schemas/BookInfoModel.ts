import { integer, numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DatabaseTable } from "../enums/DatabaseTable";
import { BookStatus } from "~/api/enums/BookStatus";
import { BookType } from "~/api/enums/BookType";

export const BookInfoModel = sqliteTable(
  DatabaseTable.BOOKS_INFO,
  {
    id: integer().primaryKey({autoIncrement: true}).notNull(),
    path: text().notNull(),
    url: text().notNull(),
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
