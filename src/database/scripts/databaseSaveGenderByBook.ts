import { and, eq } from "drizzle-orm";
import { db } from "../database";
import { BookGenderByBookInfo } from "../schemas/BookGenderByBookInfo";

export async function databaseSaveGenderByBook(id_bookgender: number, id_bookinfo: number) {
  const find = await db
    .select()
    .from(BookGenderByBookInfo)
    .where(
      and(
        eq(BookGenderByBookInfo.id_bookinfo, id_bookinfo),
        eq(BookGenderByBookInfo.id_bookgender, id_bookgender),
      ),
    );

  if (!find.length) {
    await db
      .insert(BookGenderByBookInfo)
      .values({
        id_bookinfo: id_bookinfo,
        id_bookgender: id_bookgender,
      });
  }
}