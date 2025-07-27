import { eq } from "drizzle-orm";
import { db } from "../database";
import { BookUserChapterBookHistoryModel } from "../schemas/BookUserChapterBookHistoryModel";

export async function getCurrentHistoryBook(id_bookinfo: number) {
  const info = await db
    .select()
    .from(BookUserChapterBookHistoryModel)
    .where(
      eq(BookUserChapterBookHistoryModel.id_bookinfo, id_bookinfo),
    );

  if (!info.length) {
    return undefined;
  }

  return info[0];
}
