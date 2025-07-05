import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { db as database } from "../database";
import { BookUserStatusByBookInfo } from "../schemas/BookUserStatusByBookInfo";
import { and, eq, inArray, not } from "drizzle-orm";
import { BookChapterHistory } from "../schemas/BookChapterHistory";
import { BookChapterModel } from "../schemas/BookChapterModel";

export async function setMarkUserBookStatus(id_bookinfo: number, status: keyof UserBookStatusList) {
  const find = await database
    .select()
    .from(BookUserStatusByBookInfo)
    .where(
      and(
        eq(BookUserStatusByBookInfo.id_bookinfo, id_bookinfo),
        eq(BookUserStatusByBookInfo.status, status),
      ),
    );

  if (find[0].marked) {
    await database
      .update(BookUserStatusByBookInfo)
      .set({
        marked: false,
      })
      .where(
        and(
          eq(BookUserStatusByBookInfo.id_bookinfo, id_bookinfo),
          eq(BookUserStatusByBookInfo.status, status),
        ),
      );

    const chapters = await database
      .select()
      .from(BookChapterModel)
      .where(eq(BookChapterModel.id_bookinfo, id_bookinfo));


    await database
      .update(BookChapterHistory)
      .set({
        status: false,
      })
      .where(
        inArray(
          BookChapterHistory.id_chapter,
          chapters.map(v => v.id),
        ),
      );

    return false;
  }

  await database
    .update(BookUserStatusByBookInfo)
    .set({
      marked: true,
    })
    .where(
      and(
        eq(BookUserStatusByBookInfo.id_bookinfo, id_bookinfo),
        eq(BookUserStatusByBookInfo.status, status),
      ),
    );

  await database
    .update(BookUserStatusByBookInfo)
    .set({
      marked: false,
    })
    .where(
      and(
        eq(BookUserStatusByBookInfo.id_bookinfo, id_bookinfo),
        not(eq(BookUserStatusByBookInfo.status, status)),
      ),
    );
  
  return true;
}
