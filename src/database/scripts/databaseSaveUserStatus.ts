import { UserBookStatus } from "~/api/interfaces/UserBookStatus";
import { db } from "../database";
import { BookUserStatusByBookInfo } from "../schemas/BookUserStatusByBookInfo";
import { and, eq } from "drizzle-orm";

export async function databaseSaveUserStatus(id_bookinfo: number, data: UserBookStatus) {
  const keys = Object.keys(data) as (keyof UserBookStatus)[];

  for (const key of keys) {
    const value = data[key];

    const find = await db
      .select()
      .from(BookUserStatusByBookInfo)
      .where(
        and(
          eq(BookUserStatusByBookInfo.id_bookinfo, id_bookinfo),
          eq(BookUserStatusByBookInfo.status, key),
        ),
      );

    if (!find.length) {
      await db
        .insert(BookUserStatusByBookInfo)
        .values({
          id_bookinfo: id_bookinfo,
          status: key,
          value: value.quantity,
          marked: false,
        });

      continue;
    }

    await db
      .update(BookUserStatusByBookInfo)
      .set({
        value: value.quantity,
      })
      .where(
        and(
          eq(BookUserStatusByBookInfo.id_bookinfo, id_bookinfo),
          eq(BookUserStatusByBookInfo.status, key),
        ),
      );
  }
}
