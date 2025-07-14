import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { db } from "../database";
import { BookInfoModel } from "../schemas/BookInfoModel";
import { databaseSaveUserStatus } from "./databaseSaveUserStatus";
import { databaseSaveBookStaff } from "./databaseSaveBookStaff";
import { databaseSaveGendersByBook } from "./databaseSaveGendersByBook";
import { databaseSaveChapters } from "./databaseSaveChapters";
import { getIfExistObject } from "../utils/getIfExistObject";

export async function databaseSaveBook(data: BookInfoInterface) {
  const [{idBookInfo}] = await db
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

  if (data.genders) {
    await databaseSaveGendersByBook(
      data.genders,
      idBookInfo,
    );
  }

  if (data.chapters && data.chapters.length) {
    await databaseSaveChapters(
      data.chapters,
      idBookInfo,
    );
  }

  if (data.user_status) {
    await databaseSaveUserStatus(
      idBookInfo,
      data.user_status,
    );
  }

  if (data.staff?.length) {
    await databaseSaveBookStaff(
      idBookInfo,
      data.staff,
    );
  }
}