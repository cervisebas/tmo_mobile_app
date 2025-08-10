import { eq } from "drizzle-orm";
import { db } from "../database";
import { BookUserChapterHistoryModel } from "../schemas/BookUserChapterHistoryModel";

export async function removeUserChapterHistory(id: number) {
  await db
    .delete(BookUserChapterHistoryModel)
    .where(
      eq(
        BookUserChapterHistoryModel.id,
        id,
      ),
    );
}
