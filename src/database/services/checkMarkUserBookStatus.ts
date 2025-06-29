import { UserStatus } from "~/api/interfaces/UserBookStatus";
import { getMarkUserBookStatus } from "./getMarkUserBookStatus";

export async function checkMarkUserBookStatus(id_bookinfo: number) {
  const status_list = await getMarkUserBookStatus(id_bookinfo);
  const values = Object.values(status_list) as UserStatus[];

  return values.some(v => v.user_select);
}