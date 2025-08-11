import { eq } from "drizzle-orm";
import { db } from "../database";
import { BookChapterModel } from "../schemas/BookChapterModel";
import { BookUserChapterHistoryModel } from "../schemas/BookUserChapterHistoryModel";
import { BookInfoModel } from "../schemas/BookInfoModel";
import { BookChapterOptionModel } from "../schemas/BookChapterOptionModel";
import { UserChapterHistoryInterface } from "../interfaces/UserChapterHistoryInterface";
import { DatabaseTableName } from "../enums/DatabaseTableName";
import { BookType } from "~/api/enums/BookType";
import { BookStatus } from "~/api/enums/BookStatus";
import { extractNumberChapter } from "~/utils/extractNumberChapter";

export async function getAllUserChapterHistory() {
  try {
    const find_all = await db
      .select()
      .from(BookUserChapterHistoryModel)
      .innerJoin(
        BookInfoModel,
        eq(
          BookInfoModel.id,
          BookUserChapterHistoryModel.id_bookinfo,
        ),
      )
      .innerJoin(
        BookChapterModel,
        eq(
          BookChapterModel.id,
          BookUserChapterHistoryModel.id_chapter,
        ),
      )
      .innerJoin(
        BookChapterOptionModel,
        eq(
          BookChapterOptionModel.id_chapter,
          BookChapterModel.id,
        ),
      );
    
    const data: UserChapterHistoryInterface[] = [];
    
    for (const item of find_all) {
      const find_book = data.findIndex(v => v.chapter.id === item[DatabaseTableName.BOOK_CHAPTERS].id);
      
      if (find_book === -1) {
        const temp: Partial<UserChapterHistoryInterface> = {
          id: item[DatabaseTableName.BOOK_USER_CHAPTER_HISTORY_MODEL].id,
          date: item[DatabaseTableName.BOOK_USER_CHAPTER_HISTORY_MODEL].date,
          book: {
            id: item[DatabaseTableName.BOOKS_INFO].id,
            
            path: item[DatabaseTableName.BOOKS_INFO].path,
            url: item[DatabaseTableName.BOOKS_INFO].url,
            title: item[DatabaseTableName.BOOKS_INFO].title,
            picture: item[DatabaseTableName.BOOKS_INFO].picture,
            stars: item[DatabaseTableName.BOOKS_INFO].stars,
            type: item[DatabaseTableName.BOOKS_INFO].type as BookType,
      
            status: item[DatabaseTableName.BOOKS_INFO].status as BookStatus,
            description: item[DatabaseTableName.BOOKS_INFO].description ?? '',
            wallpaper: item[DatabaseTableName.BOOKS_INFO].wallpaper!,
            subtitle: item[DatabaseTableName.BOOKS_INFO].subtitle ?? '',
          },
          chapter: {
            id: item[DatabaseTableName.BOOK_CHAPTERS].id,
            title: item[DatabaseTableName.BOOK_CHAPTERS].name,
            data_chapter: item[DatabaseTableName.BOOK_CHAPTERS].data_chapter,
            chapter_number: extractNumberChapter(item[DatabaseTableName.BOOK_CHAPTERS].name),
            options: [
              {
                title: item[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.title,
                date: item[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.date,
                path: item[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.path,
              },
            ],
          },
        };
        data.push(temp as UserChapterHistoryInterface);
        continue;
      }
  
      const option = {
        title: item[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.title,
        date: item[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.date,
        path: item[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.path,
      };
      data[find_book].chapter.options.push(option);
    }
  
    return data.sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
