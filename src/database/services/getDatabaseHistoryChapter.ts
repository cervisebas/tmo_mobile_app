import { eq, inArray } from "drizzle-orm";
import { db } from "../database";
import { BookChapterHistoryModel } from "../schemas/BookChapterHistoryModel";

interface HistoryChapter {
  id: number;
  status: boolean;
}

export async function getDatabaseHistoryChapter<T extends (number | number[])>(id_chapter: T): Promise<T extends number ? boolean : HistoryChapter[]> {
  const find = await db
    .select()
    .from(BookChapterHistoryModel)
    .where(
      Array.isArray(id_chapter)
        ? inArray(BookChapterHistoryModel.id_chapter, id_chapter)
        : eq(BookChapterHistoryModel.id_chapter, id_chapter),
    );

  if (!find.length) {
    if (Array.isArray(id_chapter)) {
      return [] as any;
    }
    return false as any;
  }

  if (Array.isArray(id_chapter)) {
    return find.map(v => ({
      id: v.id_chapter,
      status: v.status,
    })) as any;
  }

  return find[0]?.status as any;
}