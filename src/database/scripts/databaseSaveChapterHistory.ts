import { sql } from "drizzle-orm";
import { db } from "../database";
import { BookChapterHistoryModel } from "../schemas/BookChapterHistoryModel";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";

export async function databaseSaveChapterHistory(chapter: ChapterInterface, status: boolean) {
  await db
    .insert(BookChapterHistoryModel)
    .values({
      id_chapter: chapter.id!,
      status: status,
    })
    .onConflictDoUpdate({
      target: BookChapterHistoryModel.id_chapter,
      set: {
        status: sql`excluded.status`,
      },
    });
}