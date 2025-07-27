import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { ChapterOptionInterface } from "~/api/interfaces/ChapterOptionInterface";
import { db } from "../database";
import { BookChapterModel } from "../schemas/BookChapterModel";
import { BookChapterOptionModel } from "../schemas/BookChapterOptionModel";
import { eq } from "drizzle-orm";
import { DatabaseTableName } from "../enums/DatabaseTableName";
import { extractNumberChapter } from "~/utils/extractNumberChapter";

export async function getBookChapterInfo(id_chapter: number): Promise<ChapterInterface | undefined> {
  const db_chapter = await db
    .select()
    .from(BookChapterModel)
    .leftJoin(
      BookChapterOptionModel,
      eq(
        BookChapterModel.id,
        BookChapterOptionModel.id_chapter,
      ),
    )
    .where(
      eq(BookChapterModel.id, id_chapter),
    );

  if (!db_chapter.length) {
    return undefined;
  }

  const options: ChapterOptionInterface[] = [];

  for (const chapter of db_chapter) {
    options.push({
      title: chapter[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.title,
      date: chapter[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.date,
      path: chapter[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.path,
    });
  }

  return {
    id: db_chapter[0][DatabaseTableName.BOOK_CHAPTERS].id,
    title: db_chapter[0][DatabaseTableName.BOOK_CHAPTERS].name,
    data_chapter: db_chapter[0][DatabaseTableName.BOOK_CHAPTERS].data_chapter,
    chapter_number: extractNumberChapter(db_chapter[0][DatabaseTableName.BOOK_CHAPTERS].name),
    options: options,
  };
}
