import { eq } from "drizzle-orm";
import { db } from "../database";
import { BookInfoModel } from "../schemas/BookInfoModel";
import { BookChapterModel } from "../schemas/BookChapterModel";
import { BookChapterOptionModel } from "../schemas/BookChapterOptionModel";
import { BookGenderByBookInfo } from "../schemas/BookGenderByBookInfo";
import { BookGenderModel } from "../schemas/BookGenderModel";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { BookType } from "~/api/enums/BookType";
import { BookStatus } from "~/api/enums/BookStatus";
import { GenderInterface } from "~/api/interfaces/GenderInterface";
import { DatabaseTable } from "../enums/DatabaseTable";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { getMarkUserBookStatus } from "./getMarkUserBookStatus";

export async function getDatabaseBookInfo(url: string) {
  try {
    const find_book = await db
      .select()
      .from(BookInfoModel)
      .where(
        eq(BookInfoModel.url, url),
      );

    if (!find_book.length) {
      throw 'Libro no encontrado';
    }

    if (!find_book[0].wallpaper) {
      throw 'Información incompleta';
    }

    const db_chapters = await db
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
        eq(BookChapterModel.id_bookinfo, find_book[0].id),
      );
    
    if (!db_chapters.length) {
      // TODO: Ver que hago aquí
      //throw 'Información incompleta';
    }
    
    const db_genders = await db
      .select()
      .from(BookGenderByBookInfo)
      .leftJoin(
        BookGenderModel,
        eq(
          BookGenderByBookInfo.id_bookgender,
          BookGenderModel.id,
        )
      )
      .where(
        eq(
          BookGenderByBookInfo.id_bookinfo,
          find_book[0].id,
        ),
      );
    
    // ##### Make Datas
    const user_status = await getMarkUserBookStatus(find_book[0].id);


    const genders: GenderInterface[] = [];
    for (const gender of db_genders) {
      genders.push({
        value: gender[DatabaseTable.BOOK_GENDERS]!.value,
        name: gender[DatabaseTable.BOOK_GENDERS]!.name,
      });
    }

    const chapters: ChapterInterface[] = [];
    for (const chapter of db_chapters) {
      const index_found = chapters.findIndex(v => chapter[DatabaseTable.BOOK_CHAPTERS].id === v.id);

      if (index_found !== -1) {
        chapters[index_found].options.push({
          title: chapter[DatabaseTable.BOOK_CHAPTER_OPTIONS]!.title,
          date: chapter[DatabaseTable.BOOK_CHAPTER_OPTIONS]!.date,
          path: chapter[DatabaseTable.BOOK_CHAPTER_OPTIONS]!.path,
        });
        continue;
      }

      chapters.push({
        id: chapter[DatabaseTable.BOOK_CHAPTERS].id,
        title: chapter[DatabaseTable.BOOK_CHAPTERS].name,
        data_chapter: chapter[DatabaseTable.BOOK_CHAPTERS].data_chapter,
        options: [
          {
            title: chapter[DatabaseTable.BOOK_CHAPTER_OPTIONS]!.title,
            date: chapter[DatabaseTable.BOOK_CHAPTER_OPTIONS]!.date,
            path: chapter[DatabaseTable.BOOK_CHAPTER_OPTIONS]!.path,
          },
        ],
      });
    }

    const data: BookInfoInterface = {
      id: find_book[0].id,

      path: find_book[0].path,
      url: find_book[0].url,
      title: find_book[0].title,
      picture: find_book[0].picture,
      stars: find_book[0].stars,
      type: find_book[0].type as BookType,

      status: find_book[0].status as BookStatus,
      description: find_book[0].description ?? '',
      wallpaper: find_book[0].wallpaper,
      subtitle: find_book[0].subtitle ?? '',

      user_status: user_status,

      genders: genders,
      chapters: chapters,
    };

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}