import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { db } from "../database";
import { BookUserStatusByBookInfo } from "../schemas/BookUserStatusByBookInfo";
import { eq } from "drizzle-orm";

export async function getMarkUserBookStatus(id_bookinfo: number) {
  const data: Record<string, UserBookStatusList['abandoned']> = {};

  const db_statuses = await db
    .select()
    .from(BookUserStatusByBookInfo)
    .where(
      eq(BookUserStatusByBookInfo.id_bookinfo, id_bookinfo),
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
