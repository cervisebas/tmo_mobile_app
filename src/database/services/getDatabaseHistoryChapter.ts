import { eq } from "drizzle-orm";
import { db } from "../database";
import { BookChapterHistory } from "../schemas/BookChapterHistory";

export async function getDatabaseHistoryChapter(id_chapter: number) {
  const find = await db
    .select()
    .from(BookChapterHistory)
    .where(
      eq(BookChapterHistory.id_chapter, id_chapter),
    );

  if (!find.length) {
    return false;
  }

  return find[0].status;
}