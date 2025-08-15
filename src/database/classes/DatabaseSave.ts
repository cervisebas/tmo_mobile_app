import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { db as database } from "../database";
import { BookInfoModel } from "../schemas/BookInfoModel";
import { getIfExistObject } from "../utils/getIfExistObject";
import { GenderInterface } from "~/api/interfaces/GenderInterface";
import { BookGenderModel } from "../schemas/BookGenderModel";
import { desc, sql } from "drizzle-orm";
import { BookGenderByBookInfoModel } from "../schemas/BookGenderByBookInfoModel";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { BookChapterModel } from "../schemas/BookChapterModel";
import { BookChapterOptionModel } from "../schemas/BookChapterOptionModel";
import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { BookUserStatusByBookInfoModel } from "../schemas/BookUserStatusByBookInfoModel";
import { BookStaffInterface } from "~/api/interfaces/BookStaffInterface";
import { BookStaffModel } from "../schemas/BookStaffModel";
import { BookStaffByBookInfoModel } from "../schemas/BookStaffByBookInfoModel";
import { BookChapterHistoryModel } from "../schemas/BookChapterHistoryModel";
import { BookUserChapterHistoryModel } from "../schemas/BookUserChapterHistoryModel";
import { ChapterOptionInterface } from "~/api/interfaces/ChapterOptionInterface";
import { BookUserChapterBookHistoryModel } from "../schemas/BookUserChapterBookHistoryModel";

export class DatabaseSave {
  private db: typeof database;
  
  constructor(useDb = database) {
    this.db = useDb;
  }

  public async saveBook(data: BookInfoInterface) {
    const [{idBookInfo}] = await this.db
      .insert(BookInfoModel)
      .values({
        path: data.path,
        url: data.url,
        title: data.title,
        picture: data.picture,
        stars: data.stars,
        type: data.type,
  
        status: data.status ?? null,
        subtitle: data.subtitle ?? null,
        description: data.description ?? null,
        wallpaper: data.wallpaper ?? null,
      })
      .onConflictDoUpdate({
        target: BookInfoModel.url,
        set: {
          picture: data.picture,
          stars: data.stars,
          ...getIfExistObject({
            title: data.title,
            subtitle: data.subtitle,
            status: data.status,
            description: data.description,
            wallpaper: data.wallpaper,
          }),
        },
      })
      .returning({
        idBookInfo: BookInfoModel.id,
      });
  
    if (data.genders && data.genders.length) {
      await this.saveGendersByBook(
        data.genders,
        idBookInfo,
      );
    }
  
    if (data.chapters && data.chapters.length) {
      await this.saveChapters(
        data.chapters,
        idBookInfo,
      );
    }
  
    if (data.user_status) {
      await this.saveUserStatus(
        idBookInfo,
        data.user_status,
      );
    }
  
    if (data.staff && data.staff.length) {
      await this.saveBookStaff(
        idBookInfo,
        data.staff,
      );
    }
  }

  public async saveBookStaff(id_bookinfo: number, staff_list: BookStaffInterface[]) {
    const staff = await this.db
      .insert(BookStaffModel)
      .values(
        staff_list.map(v => ({
          url: v.url,
          name: v.name,
          image: v.picture,
          search_name: v.search_name,
        })),
      )
      .onConflictDoUpdate({
        target: BookStaffModel.url,
        set: {
          name: sql`excluded.name`,
          image: sql`excluded.image`,
        },
      })
      .returning({
        id: BookStaffModel.id,
        url: BookStaffModel.url,
      });
  
    await this.db
      .insert(BookStaffByBookInfoModel)
      .values(
        staff_list.map(v => ({
          id_bookinfo: id_bookinfo,
          id_bookstaff: staff.find(f => f.url === v.url)!.id,
          position: v.position,
        })),
      )
      .onConflictDoNothing();
  }

  public async saveChapters(data: ChapterInterface[], id_bookinfo: number) {
    const inserts = await this.db
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
    
    await database
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

  public async saveChaptersHistory(
    chapter: {
      id_chapter: number;
      status: boolean;
    }[],
    default_status?: boolean
  ) {
    await this.db
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

  public async saveGendersByBook(genders: GenderInterface[], id_bookinfo: number) {
    const inserts = await database
      .insert(BookGenderModel)
      .values(
        genders.map(v => ({
          name: v.name,
          value: v.value,
        })),
      )
      .onConflictDoUpdate({
        target: BookGenderModel.value,
        set: {
          name: sql`excluded.name`,
        },
      })
      .returning({
        id: BookGenderModel.id,
      });
  
    await database
      .insert(BookGenderByBookInfoModel)
      .values(
        inserts.map(v => ({
          id_bookinfo: id_bookinfo,
          id_bookgender: v.id,
        })),
      )
      .onConflictDoNothing();
  }

  public async saveUserChapterHistory(id_bookinfo: number, id_chapter: number) {
    const lastUser = await this.db
      .select()
      .from(BookUserChapterHistoryModel)
      .orderBy(desc(BookUserChapterHistoryModel.id))
      .limit(1);
  
    if (lastUser.length === 0 || !(lastUser[0]?.id_bookinfo === id_bookinfo && lastUser[0]?.id_chapter === id_chapter)) {
      await this.db
        .insert(BookUserChapterHistoryModel)
        .values({
          id_bookinfo: id_bookinfo,
          id_chapter: id_chapter,
          date: new Date(),
        });
    }
  }

  public async saveUserHistory(
    id_bookinfo: number,
    chapter: ChapterInterface,
    option: ChapterOptionInterface,
    progress: number,
  ) {
    await this.db
      .insert(BookUserChapterBookHistoryModel)
      .values({
        id_bookinfo: id_bookinfo,
        id_chapter: chapter.id!,
        path_option: option.path,
        progress: String(progress),
      })
      .onConflictDoUpdate({
        target: BookUserChapterBookHistoryModel.id_bookinfo,
        set: {
          progress: sql`excluded.progress`,
          id_chapter: sql`excluded.id_chapter`,
          path_option: sql`excluded.path_option`,
        },
      });
  }

  public async saveUserStatus(id_bookinfo: number, data: UserBookStatusList) {
    const keys = Object.keys(data) as (keyof UserBookStatusList)[];
    
    await this.db
      .insert(BookUserStatusByBookInfoModel)
      .values(
        keys.map(key => {
          const value = data[key];
  
          return {
            id_bookinfo: id_bookinfo,
            status: key,
            value: value.quantity,
            marked: false,
          };
        }),
      )
      .onConflictDoUpdate({
        target: [
          BookUserStatusByBookInfoModel.id_bookinfo,
          BookUserStatusByBookInfoModel.status,
        ],
        set: {
          value: sql`excluded.value`,
        },
      });
  }
}
