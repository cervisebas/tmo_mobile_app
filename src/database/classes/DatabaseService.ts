import { UserBookStatusList, UserStatus } from "~/api/interfaces/UserBookStatus";
import { db as database } from "../database";
import { DatabaseSave } from "./DatabaseSave";
import { BookInfoModel } from "../schemas/BookInfoModel";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { BookUserChapterHistoryModel } from "../schemas/BookUserChapterHistoryModel";
import { and, eq, inArray, not } from "drizzle-orm";
import { BookChapterModel } from "../schemas/BookChapterModel";
import { BookChapterOptionModel } from "../schemas/BookChapterOptionModel";
import { UserChapterHistoryInterface } from "../interfaces/UserChapterHistoryInterface";
import { DatabaseTableName } from "../enums/DatabaseTableName";
import { BookType } from "~/api/enums/BookType";
import { BookStatus } from "~/api/enums/BookStatus";
import { extractNumberChapter } from "~/utils/extractNumberChapter";
import { BookUserChapterBookHistoryModel } from "../schemas/BookUserChapterBookHistoryModel";
import { BookGenderByBookInfoModel } from "../schemas/BookGenderByBookInfoModel";
import { BookGenderModel } from "../schemas/BookGenderModel";
import { BookStaffByBookInfoModel } from "../schemas/BookStaffByBookInfoModel";
import { BookStaffModel } from "../schemas/BookStaffModel";
import { GenderInterface } from "~/api/interfaces/GenderInterface";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { BookStaffInterface } from "~/api/interfaces/BookStaffInterface";
import { BookChapterHistoryModel } from "../schemas/BookChapterHistoryModel";
import { BookUserStatusByBookInfoModel } from "../schemas/BookUserStatusByBookInfoModel";
import { UserBookStatus } from "~/api/enums/UserBookStatus";

export class DatabaseService {
  private db: typeof database;
  private dbSave: DatabaseSave;
  
  constructor(useDb = database) {
    this.db = useDb;
    this.dbSave = new DatabaseSave(useDb);
  }

  public async checkMarkUserBookStatus(id_bookinfo: number) {
    const status_list = await this.getMarkUserBookStatus(id_bookinfo);
    const values = Object.values(status_list) as UserStatus[];
  
    return values.some(v => v.user_select);
  }

  public async getAllSavedBooks(): Promise<BookInfoInterface[]> {
    const books = await this.db
      .select()
      .from(BookInfoModel);
  
    return books.map(value => ({
      id: value.id,
      path: value.path,
      url: value.url,
      title: value.title,
      picture: value.picture,
      stars: value.stars,
      type: value.type,
    }));
  }

  public async getAllUserChapterHistory() {
    try {
      const find_all = await this.db
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

  public async getCurrentHistoryBook(id_bookinfo: number) {
    const info = await this.db
      .select()
      .from(BookUserChapterBookHistoryModel)
      .where(
        eq(BookUserChapterBookHistoryModel.id_bookinfo, id_bookinfo),
      );
  
    if (!info.length) {
      return undefined;
    }
  
    return info[0];
  }

  public async getDatabaseBookInfo(url: string | null, id_bookinfo?: number) {
    try {
      if (!url && !id_bookinfo) {
        throw 'Información proporcionada no valida';
      }
  
      const find_book = await this.db
        .select()
        .from(BookInfoModel)
        .where(
          id_bookinfo
            ? eq(BookInfoModel.id, id_bookinfo)
            : eq(BookInfoModel.url, url!),
        );
  
      if (!find_book.length) {
        throw 'Libro no encontrado';
      }
  
      if (!find_book[0].wallpaper) {
        throw 'Información incompleta';
      }
  
      const db_chapters = await this.db
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
      
      const db_genders = await this.db
        .select()
        .from(BookGenderByBookInfoModel)
        .leftJoin(
          BookGenderModel,
          eq(
            BookGenderByBookInfoModel.id_bookgender,
            BookGenderModel.id,
          )
        )
        .where(
          eq(
            BookGenderByBookInfoModel.id_bookinfo,
            find_book[0].id,
          ),
        );
      
      const db_staff = await this.db
        .select()
        .from(BookStaffByBookInfoModel)
        .leftJoin(
          BookStaffModel,
          eq(
            BookStaffByBookInfoModel.id_bookstaff,
            BookStaffModel.id,
          ),
        )
        .where(
          eq(
            BookStaffByBookInfoModel.id_bookinfo,
            find_book[0].id,
          )
        );
  
      // ##### Make Datas
      const user_status = await this.getMarkUserBookStatus(find_book[0].id);
  
  
      const genders: GenderInterface[] = [];
      for (const gender of db_genders) {
        genders.push({
          value: gender[DatabaseTableName.BOOK_GENDERS]!.value,
          name: gender[DatabaseTableName.BOOK_GENDERS]!.name,
        });
      }
  
      let chapters: ChapterInterface[] = [];
      for (const chapter of db_chapters) {
        const index_found = chapters.findIndex(v => chapter[DatabaseTableName.BOOK_CHAPTERS].id === v.id);
  
        if (index_found !== -1) {
          chapters[index_found].options.push({
            title: chapter[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.title,
            date: chapter[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.date,
            path: chapter[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.path,
          });
          continue;
        }
  
        chapters.push({
          id: chapter[DatabaseTableName.BOOK_CHAPTERS].id,
          title: chapter[DatabaseTableName.BOOK_CHAPTERS].name,
          data_chapter: chapter[DatabaseTableName.BOOK_CHAPTERS].data_chapter,
          chapter_number: extractNumberChapter(chapter[DatabaseTableName.BOOK_CHAPTERS].name),
          options: [
            {
              title: chapter[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.title,
              date: chapter[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.date,
              path: chapter[DatabaseTableName.BOOK_CHAPTER_OPTIONS]!.path,
            },
          ],
        });
      }
      chapters = chapters.sort((a, b) => b.chapter_number - a.chapter_number);
  
      const staff_list: BookStaffInterface[] = [];
      for (const staff of db_staff) {
        staff_list.push({
          id: staff[DatabaseTableName.BOOK_STAFF]!.id,
          url: staff[DatabaseTableName.BOOK_STAFF]!.url,
          name: staff[DatabaseTableName.BOOK_STAFF]!.name,
          picture: staff[DatabaseTableName.BOOK_STAFF]!.image,
          position: staff[DatabaseTableName.BOOK_STAFF_BY_BOOKS_INFO].position,
          search_name: staff[DatabaseTableName.BOOK_STAFF]!.search_name,
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
  
        staff: staff_list,
      };
  
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getDatabaseHistoryChapter<T extends (number | number[])>(id_chapter: T):
    Promise<T extends number ? boolean : {
      id: number;
      status: boolean;
    }[]> {
    const find = await this.db
      .select()
      .from(BookChapterHistoryModel)
      .where(
        Array.isArray(id_chapter)
          ? inArray(BookChapterHistoryModel.id_chapter, id_chapter)
          : eq(BookChapterHistoryModel.id_chapter, id_chapter),
      );
  
    if (!find.length) {
      if (Array.isArray(id_chapter)) {
        return [] as any;
      }
      return false as any;
    }
  
    if (Array.isArray(id_chapter)) {
      return find.map(v => ({
        id: v.id_chapter,
        status: v.status,
      })) as any;
    }
  
    return find[0]?.status as any;
  }

  public async getMarkUserBookStatus(id_bookinfo: number) {
    const data: Record<string, UserBookStatusList['abandoned']> = {};

    const db_statuses = await this.db
      .select()
      .from(BookUserStatusByBookInfoModel)
      .where(
        eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
      );

    for (const status of db_statuses) {
      Object.assign(
        data,
        {
          [status.status]: {
            quantity: status.value,
            user_select: status.marked,
          },
        },
      );
    }

    return data as unknown as UserBookStatusList;
  }

  public async getUserStatusBooks(status: UserBookStatus | 'all'): Promise<BookInfoInterface[]> {
    const books = await this.db
      .select()
      .from(BookUserStatusByBookInfoModel)
      .innerJoin(
        BookInfoModel,
        eq(
          BookInfoModel.id,
          BookUserStatusByBookInfoModel.id_bookinfo,
        ),
      )
      .where(
        status === 'all'
          ? eq(
            BookUserStatusByBookInfoModel.marked,
            true,
          )
          : and(
            eq(
              BookUserStatusByBookInfoModel.status,
              status,
            ),
            eq(
              BookUserStatusByBookInfoModel.marked,
              true,
            ),
          ),
      );
  
    return books.map(value => ({
      id: value[DatabaseTableName.BOOKS_INFO].id,
      path: value[DatabaseTableName.BOOKS_INFO].path,
      url: value[DatabaseTableName.BOOKS_INFO].url,
      title: value[DatabaseTableName.BOOKS_INFO].title,
      picture: value[DatabaseTableName.BOOKS_INFO].picture,
      stars: value[DatabaseTableName.BOOKS_INFO].stars,
      type: value[DatabaseTableName.BOOKS_INFO].type,
      status: value[DatabaseTableName.BOOKS_INFO].status!,
    }));
  }

  public async getUserStatusCount() {
    const user_status = await this.db
      .select()
      .from(BookUserStatusByBookInfoModel);

    const data: UserBookStatusList = {
      [UserBookStatus.WATCH]: {
        quantity: '0',
        user_select: false,
      },
      [UserBookStatus.PENDING]: {
        quantity: '0',
        user_select: false,
      },
      [UserBookStatus.FOLLOW]: {
        quantity: '0',
        user_select: false,
      },
      [UserBookStatus.WISH]: {
        quantity: '0',
        user_select: false,
      },
      [UserBookStatus.HAVE]: {
        quantity: '0',
        user_select: false,
      },
      [UserBookStatus.ABANDONED]: {
        quantity: '0',
        user_select: false,
      },
    };

    for (const status of user_status) {
      if (status.marked) {
        data[status.status].quantity = String(Number(data[status.status].quantity) + 1);
      }
    }

    return data;
  }

  public async removeAllUserChapterHistory() {
    await this.db
      .delete(BookUserChapterHistoryModel);
  }

  public async removeUserChapterHistory(id: number) {
    await this.db
      .delete(BookUserChapterHistoryModel)
      .where(
        eq(
          BookUserChapterHistoryModel.id,
          id,
        ),
      );
  }

  public async setDatabaseBooks(data: BookInfoInterface[]) {
    try {
      for (const item of data) {
        await this.dbSave.saveBook(item);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async setDatabaseHistoryChapter(
    id_bookinfo: number,
    chapterList: ChapterInterface[],
    chapter: ChapterInterface,
    status: boolean,
  ) {
    const isStatusMarked = await this.checkMarkUserBookStatus(id_bookinfo);
  
    if (!isStatusMarked && status) {
      throw 'Es necesario clasificar la obra en un estado para marcar los capítulos vistos.';
    }
    
    const indexOf = chapterList.indexOf(chapter);
  
    if (indexOf === -1) {
      return;
    }
  
    const chapter_set_list: Parameters<typeof this.dbSave.saveChaptersHistory>[0] = [];
  
    for (const item of chapterList) {
      if (chapter.chapter_number >= item.chapter_number) {
        chapter_set_list.push({
          id_chapter: item.id!,
          //status: true,
          status:
            chapter.chapter_number === item.chapter_number
              ? status
              : true
          ,
        });
      } else {
        chapter_set_list.push({
          id_chapter: item.id!,
          status: false,
        });
      }
    }
  
    await this.dbSave.saveChaptersHistory(chapter_set_list);
  
    return status;
  }

  private async unmarkAllChapters(id_bookinfo: number) {
    const chapters = await this.db
      .select()
      .from(BookChapterModel)
      .where(eq(BookChapterModel.id_bookinfo, id_bookinfo));

    await this.db
      .update(BookChapterHistoryModel)
      .set({
        status: false,
      })
      .where(
        inArray(
          BookChapterHistoryModel.id_chapter,
          chapters.map(v => v.id),
        ),
      );
  }

  public async setMarkUserBookStatus(id_bookinfo: number, status: keyof UserBookStatusList) {
    const find = await this.db
      .select()
      .from(BookUserStatusByBookInfoModel)
      .where(
        and(
          eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
          eq(BookUserStatusByBookInfoModel.status, status),
        ),
      );
  
    if (find[0].marked) {
      await this.db
        .update(BookUserStatusByBookInfoModel)
        .set({
          marked: false,
        })
        .where(
          and(
            eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
            eq(BookUserStatusByBookInfoModel.status, status),
          ),
        );
      
      await this.unmarkAllChapters(id_bookinfo);
  
      return false;
    }
  
    const already_mark = await this.db
      .select()
      .from(BookUserStatusByBookInfoModel)
      .where(
        and(
          eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
          eq(BookUserStatusByBookInfoModel.marked, true),
        ),
      );
    
    if (already_mark.length === 0) {
      await this.unmarkAllChapters(id_bookinfo);
    }
  
    await this.db
      .update(BookUserStatusByBookInfoModel)
      .set({
        marked: true,
      })
      .where(
        and(
          eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
          eq(BookUserStatusByBookInfoModel.status, status),
        ),
      );
  
    await this.db
      .update(BookUserStatusByBookInfoModel)
      .set({
        marked: false,
      })
      .where(
        and(
          eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
          not(eq(BookUserStatusByBookInfoModel.status, status)),
        ),
      );
    
    return true;
  }

  public async removeDatabaseChapter(id_chapter: number) {
    this.db.transaction(async tx => {
      await tx
        .delete(BookChapterOptionModel)
        .where(
          eq(
            BookChapterOptionModel.id_chapter,
            id_chapter,
          ),
        );

      await tx
        .delete(BookChapterModel)
        .where(
          eq(
            BookChapterModel.id,
            id_chapter,
          ),
        );
    });
  }
}
