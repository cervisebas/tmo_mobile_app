import { eq, inArray } from "drizzle-orm";
import { db } from "../database";
import { BookChapterHistory } from "../schemas/BookChapterHistory";

interface HistoryChapter {
  id: number;
  status: boolean;
}

export async function getDatabaseHistoryChapter<T extends (number | number[])>(id_chapter: T): Promise<T extends number ? boolean : HistoryChapter[]> {
  //Array.isArray(id_chapter) && console.log(id_chapter);
  const find = await db
    .select()
    .from(BookChapterHistory)
    .where(
      Array.isArray(id_chapter)
        ? inArray(BookChapterHistory.id_chapter, id_chapter)
        : eq(BookChapterHistory.id_chapter, id_chapter),
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