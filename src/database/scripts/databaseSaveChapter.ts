import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { db } from "../database";
import { BookChapterModel } from "../schemas/BookChapterModel";
import { BookChapterOptionModel } from "../schemas/BookChapterOptionModel";
import { eq } from "drizzle-orm";
import { databaseSaveChapterOption } from "./databaseSaveChapterOption";

export async function databaseSaveChapter(id_bookinfo: number, data: ChapterInterface) {
  const find = await db
    .select()
    .from(BookChapterModel)
    .leftJoin(
      BookChapterOptionModel,
      eq(
        BookChapterModel.id,
        BookChapterOptionModel.id_chapter
      ),
    )
    .where(
      eq(BookChapterModel.id_bookinfo, id_bookinfo),
    );

  if (!find.length) {
    const insert = await db.insert(BookChapterModel).values({
      id_bookinfo: id_bookinfo,
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
      find.at(0)?.["book-chapters"].id!,
      option,
    );
  }
}
