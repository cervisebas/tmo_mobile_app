import { eq } from "drizzle-orm";
import { db } from "../database";
import { BookChapterHistoryModel } from "../schemas/BookChapterHistoryModel";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";

export async function databaseSaveChapterHistory(chapter: ChapterInterface, status: boolean) {
  const find = await db
    .select()
    .from(BookChapterHistoryModel)
    .where(
      eq(BookChapterHistoryModel.id_chapter, chapter.id ?? -1),
    );

  if (!find.length) {
    await db
      .insert(BookChapterHistoryModel)
      .values({
        id_chapter: chapter.id!,
        status: status,
      });

    return;
  }


  await db
    .update(BookChapterHistoryModel)
    .set({status: status})
    .where(
      eq(BookChapterHistoryModel.id_chapter, chapter.id ?? -1),
    );
}