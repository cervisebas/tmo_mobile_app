import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { db } from "../database";
import { BookUserStatusByBookInfoModel } from "../schemas/BookUserStatusByBookInfoModel";
import { UserBookStatus } from "~/api/enums/UserBookStatus";

export async function getUserStatusCount() {
  const user_status = await db
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
