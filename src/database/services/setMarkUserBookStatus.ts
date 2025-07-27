import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { db as database } from "../database";
import { BookUserStatusByBookInfoModel } from "../schemas/BookUserStatusByBookInfoModel";
import { and, eq, inArray, not } from "drizzle-orm";
import { BookChapterHistoryModel } from "../schemas/BookChapterHistoryModel";
import { BookChapterModel } from "../schemas/BookChapterModel";

async function unmarkAllChapters(id_bookinfo: number) {
  const chapters = await database
    .select()
    .from(BookChapterModel)
    .where(eq(BookChapterModel.id_bookinfo, id_bookinfo));

  await database
    .update(BookChapterHistoryModel)
    .set({
      status: false,
    })
    .where(
      inArray(
        BookChapterHistoryModel.id_chapter,
        chapters.map(v => v.id),
      ),
    );
}

export async function setMarkUserBookStatus(id_bookinfo: number, status: keyof UserBookStatusList) {
  const find = await database
    .select()
    .from(BookUserStatusByBookInfoModel)
    .where(
      and(
        eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
        eq(BookUserStatusByBookInfoModel.status, status),
      ),
    );

  if (find[0].marked) {
    await database
      .update(BookUserStatusByBookInfoModel)
      .set({
        marked: false,
      })
      .where(
        and(
          eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
          eq(BookUserStatusByBookInfoModel.status, status),
        ),
      );
    
    await unmarkAllChapters(id_bookinfo);

    return false;
  }

  const already_mark = await database
    .select()
    .from(BookUserStatusByBookInfoModel)
    .where(
      and(
        eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
        eq(BookUserStatusByBookInfoModel.marked, true),
      ),
    );
  
  if (already_mark.length === 0) {
    await unmarkAllChapters(id_bookinfo);
  }

  await database
    .update(BookUserStatusByBookInfoModel)
    .set({
      marked: true,
    })
    .where(
      and(
        eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
        eq(BookUserStatusByBookInfoModel.status, status),
      ),
    );

  await database
    .update(BookUserStatusByBookInfoModel)
    .set({
      marked: false,
    })
    .where(
      and(
        eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
        not(eq(BookUserStatusByBookInfoModel.status, status)),
      ),
    );
  
  return true;
}
