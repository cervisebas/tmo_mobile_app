import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { db } from "../database";
import { BookUserStatusByBookInfoModel } from "../schemas/BookUserStatusByBookInfoModel";
import { sql } from "drizzle-orm";

export async function databaseSaveUserStatus(id_bookinfo: number, data: UserBookStatusList) {
  const keys = Object.keys(data) as (keyof UserBookStatusList)[];
  
  await db
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
