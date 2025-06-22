import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { db } from "../database";
import { BookInfoModel } from "../schemas/BookInfoModel";
import { eq } from "drizzle-orm";
import { databaseSaveGender } from "./databaseSaveGender";
import { databaseSaveGenderByBook } from "./databaseSaveGenderByBook";
import { databaseSaveChapter } from "./databaseSaveChapter";
import { getIfExistOr } from "../utils/getIfExistOr";
import { databaseSaveUserStatus } from "./databaseSaveUserStatus";

export async function databaseSaveBook(data: BookInfoInterface) {
  const find = await db
    .select()
    .from(BookInfoModel)
    .where(eq(BookInfoModel.url, data.url));

  if (!find.length) {
    const insert = await db.insert(BookInfoModel).values({
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
    });

    if (data.genders) {
      for (const gender of data.genders) {
        const id_bookgender = await databaseSaveGender(gender);
        
        await databaseSaveGenderByBook(
          id_bookgender,
          insert.lastInsertRowId,
        );
      }
    }

    if (data.chapters) {
      for (const chapter of data.chapters) {
        await databaseSaveChapter(
          insert.lastInsertRowId,
          chapter,
        );
      }
    }

    if (data.user_status) {
      await databaseSaveUserStatus(
        insert.lastInsertRowId,
        data.user_status,
      );
    }

    return;
  }

  await db
    .update(BookInfoModel)
    .set({
      picture: data.picture,
      stars: data.stars,
      ...getIfExistOr(data.status, {status: data.status}, {}),
      ...getIfExistOr(data.description, {description: data.description}, {}),
      ...getIfExistOr(data.wallpaper, {wallpaper: data.wallpaper}, {}),
    });

  if (data.genders) {
    for (const gender of data.genders) {
      const id_bookgender = await databaseSaveGender(gender);
      
      await databaseSaveGenderByBook(
        id_bookgender,
        find[0]!.id,
      );
    }
  }

  if (data.chapters) {
    for (const chapter of data.chapters) {
      await databaseSaveChapter(
        find[0]!.id,
        chapter,
      );
    }
  }

  if (data.user_status) {
    await databaseSaveUserStatus(
      find[0]!.id,
      data.user_status,
    );
  }
}