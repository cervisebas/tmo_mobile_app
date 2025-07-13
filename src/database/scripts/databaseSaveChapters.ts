import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { db } from "../database";
import { BookChapterModel } from "../schemas/BookChapterModel";
import { sql } from "drizzle-orm";
import { BookChapterOptionModel } from "../schemas/BookChapterOptionModel";

export async function databaseSaveChapters(data: ChapterInterface[], id_bookinfo: number) {
  const inserts = await db
    .insert(BookChapterModel)
    .values(
      data.map(v => ({
        id_bookinfo: id_bookinfo,
        data_chapter: v.data_chapter,
        name: v.title,
      })),
    )
    .onConflictDoUpdate({
      target: [
        BookChapterModel.id_bookinfo,
        BookChapterModel.data_chapter,
      ],
      set: {
        name: sql`excluded.name`,
      },
    })
    .returning({
      id: BookChapterModel.id,
      data_chapter: BookChapterModel.data_chapter,
    });
  
  await db
    .insert(BookChapterOptionModel)
    .values(
      data.map(chapter => {
        const id_chapter = inserts.find(f => f.data_chapter === chapter.data_chapter)!.id;
        
        return chapter.options.map(v => ({
          id_chapter: id_chapter,
          title: v.title,
          date: v.date,
          path: v.path,
        }));
      }).flat(),
    )
    .onConflictDoUpdate({
      target: [
        BookChapterOptionModel.id_chapter,
        BookChapterOptionModel.path,
      ],
      set: {
        title: sql`excluded.title`,
      },
    });
}
