import { eq } from "drizzle-orm";
import { db } from "../database";
import { BookChapterHistory } from "../schemas/BookChapterHistory";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";

export async function databaseSaveChapterHistory(chapter: ChapterInterface, status: boolean) {
  const find = await db
    .select()
    .from(BookChapterHistory)
    .where(
      eq(BookChapterHistory.id_chapter, chapter.id ?? -1),
    );

  if (!find.length) {
    await db
      .insert(BookChapterHistory)
      .values({
        id_chapter: chapter.id!,
        status: status,
      });

    return;
  }


  await db
    .update(BookChapterHistory)
    .set({status: status})
    .where(
      eq(BookChapterHistory.id_chapter, chapter.id ?? -1),
    );
}