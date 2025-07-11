import { and, eq } from "drizzle-orm";
import { db } from "../database";
import { BookGenderByBookInfoModel } from "../schemas/BookGenderByBookInfoModel";

export async function databaseSaveGenderByBook(id_bookgender: number, id_bookinfo: number) {
  const find = await db
    .select()
    .from(BookGenderByBookInfoModel)
    .where(
      and(
        eq(BookGenderByBookInfoModel.id_bookinfo, id_bookinfo),
        eq(BookGenderByBookInfoModel.id_bookgender, id_bookgender),
      ),
    );

  if (!find.length) {
    await db
      .insert(BookGenderByBookInfoModel)
      .values({
        id_bookinfo: id_bookinfo,
        id_bookgender: id_bookgender,
      });
  }
}