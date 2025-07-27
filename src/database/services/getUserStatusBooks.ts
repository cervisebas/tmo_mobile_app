import { UserBookStatus } from "~/api/enums/UserBookStatus";
import { db } from "../database";
import { BookInfoModel } from "../schemas/BookInfoModel";
import { BookUserStatusByBookInfoModel } from "../schemas/BookUserStatusByBookInfoModel";
import { and, eq } from "drizzle-orm";
import { DatabaseTableName } from "../enums/DatabaseTableName";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";

export async function getUserStatusBooks(status: UserBookStatus): Promise<BookInfoInterface[]> {
  const books = await db
    .select()
    .from(BookUserStatusByBookInfoModel)
    .innerJoin(
      BookInfoModel,
      eq(
        BookInfoModel.id,
        BookUserStatusByBookInfoModel.id_bookinfo,
      ),
    )
    .where(
      and(
        eq(
          BookUserStatusByBookInfoModel.status,
          status,
        ),
        eq(
          BookUserStatusByBookInfoModel.marked,
          true,
        ),
      ),
    );

  return books.map(value => ({
    id: value[DatabaseTableName.BOOKS_INFO].id,
    path: value[DatabaseTableName.BOOKS_INFO].path,
    url: value[DatabaseTableName.BOOKS_INFO].url,
    title: value[DatabaseTableName.BOOKS_INFO].title,
    picture: value[DatabaseTableName.BOOKS_INFO].picture,
    stars: value[DatabaseTableName.BOOKS_INFO].stars,
    type: value[DatabaseTableName.BOOKS_INFO].type,
  }));
}
