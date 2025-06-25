import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { db } from "../database";
import { BookChapterModel } from "../schemas/BookChapterModel";
import { and, eq } from "drizzle-orm";
import { databaseSaveChapterOption } from "./databaseSaveChapterOption";

export async function databaseSaveChapter(id_bookinfo: number, data: ChapterInterface) {
  const find = await db
    .select()
    .from(BookChapterModel)
    .where(
      and(
        eq(BookChapterModel.id_bookinfo, id_bookinfo),
        eq(BookChapterModel.name, data.title),
      ),
    );

  if (!find.length) {
    const insert = await db.insert(BookChapterModel).values({
      id_bookinfo: id_bookinfo,
      data_chapter: data.data_chapter,
      name: data.title,
    });

    for (const option of data.options) {
      await databaseSaveChapterOption(
        insert.lastInsertRowId,
        option,
      );
    }

    return;
  }

  for (const option of data.options) {
    await databaseSaveChapterOption(
      find[0].id,
      option,
    );
  }
}
