import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { db } from "../database";
import { BookUserStatusByBookInfoModel } from "../schemas/BookUserStatusByBookInfoModel";
import { and, eq } from "drizzle-orm";

export async function databaseSaveUserStatus(id_bookinfo: number, data: UserBookStatusList) {
  const keys = Object.keys(data) as (keyof UserBookStatusList)[];

  for (const key of keys) {
    const value = data[key];

    const find = await db
      .select()
      .from(BookUserStatusByBookInfoModel)
      .where(
        and(
          eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
          eq(BookUserStatusByBookInfoModel.status, key),
        ),
      );

    if (!find.length) {
      await db
        .insert(BookUserStatusByBookInfoModel)
        .values({
          id_bookinfo: id_bookinfo,
          status: key,
          value: value.quantity,
          marked: false,
        });

      continue;
    }

    await db
      .update(BookUserStatusByBookInfoModel)
      .set({
        value: value.quantity,
      })
      .where(
        and(
          eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo),
          eq(BookUserStatusByBookInfoModel.status, key),
        ),
      );
  }
}
