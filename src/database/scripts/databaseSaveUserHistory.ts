import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { ChapterOptionInterface } from "~/api/interfaces/ChapterOptionInterface";
import { db } from "../database";
import { BookUserChapterBookHistoryModel } from "../schemas/BookUserChapterBookHistoryModel";
import { sql } from "drizzle-orm";

export async function databaseSaveUserHistory(
  id_bookinfo: number,
  chapter: ChapterInterface,
  option: ChapterOptionInterface,
  progress: number,
) {
  await db
    .insert(BookUserChapterBookHistoryModel)
    .values({
      id_bookinfo: id_bookinfo,
      id_chapter: chapter.id!,
      path_option: option.path,
      progress: String(progress),
    })
    .onConflictDoUpdate({
      target: BookUserChapterBookHistoryModel.id_bookinfo,
      set: {
        progress: sql`excluded.progress`,
        id_chapter: sql`excluded.id_chapter`,
        path_option: sql`excluded.path_option`,
      },
    });
}
