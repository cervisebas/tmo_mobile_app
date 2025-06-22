import { ChapterOptionInterface } from "~/api/interfaces/ChapterOptionInterface";
import { db } from "../database";
import { BookChapterOptionModel } from "../schemas/BookChapterOptionModel";
import { and, eq } from "drizzle-orm";

export async function databaseSaveChapterOption(id_chapter: number, data: ChapterOptionInterface) {
  const find = await db
    .select()
    .from(BookChapterOptionModel)
    .where(
      and(
        eq(BookChapterOptionModel.id_chapter, id_chapter),
        eq(BookChapterOptionModel.path, data.path),
      ),
    );

  if (!find.length) {
    await db.insert(BookChapterOptionModel).values({
      id_chapter: id_chapter,
      title: data.title,
      date: data.date,
      path: data.path,
    });
  }
}
