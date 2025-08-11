import { db } from "../database";
import { BookUserChapterHistoryModel } from "../schemas/BookUserChapterHistoryModel";

export async function removeAllUserChapterHistory() {
  await db
    .delete(BookUserChapterHistoryModel);
}
