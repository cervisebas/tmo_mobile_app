import { desc } from "drizzle-orm";
import { db } from "../database";
import { BookUserChapterHistoryModel } from "../schemas/BookUserChapterHistoryModel";

export async function databaseSaveUserChapterHistory(id_bookinfo: number, id_chapter: number) {
  const lastUser = await db
    .select()
    .from(BookUserChapterHistoryModel)
    .orderBy(desc(BookUserChapterHistoryModel.id))
    .limit(1);

  if (lastUser.length === 0 || !(lastUser[0]?.id_bookinfo === id_bookinfo && lastUser[0]?.id_chapter === id_chapter)) {
    await db
      .insert(BookUserChapterHistoryModel)
      .values({
        id_bookinfo: id_bookinfo,
        id_chapter: id_chapter,
        date: new Date(),
      });
  }
}
