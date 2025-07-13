import { sql } from "drizzle-orm";
import { db } from "../database";
import { BookChapterHistoryModel } from "../schemas/BookChapterHistoryModel";

interface IProps {
  id_chapter: number;
  status: boolean;
}

export async function databaseSaveChaptersHistory(chapter: IProps[], default_status?: boolean) {
  await db
    .insert(BookChapterHistoryModel)
    .values(chapter)
    .onConflictDoUpdate({
      target: BookChapterHistoryModel.id_chapter,
      set: {
        status: default_status !== undefined
          ? default_status
          : sql`excluded.status`
        ,
      },
    });
}