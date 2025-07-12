import { BookStaffInterface } from "~/api/interfaces/BookStaffInterface";
import { db } from "../database";
import { BookStaffModel } from "../schemas/BookStaffModel";
import { sql } from "drizzle-orm";
import { BookStaffByBookInfoModel } from "../schemas/BookStaffByBookInfoModel";

export async function databaseSaveBookStaff(id_bookinfo: number, staff_list: BookStaffInterface[]) {
  const staff = await db
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

  await db
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
