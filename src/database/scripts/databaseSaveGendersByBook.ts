import { sql } from "drizzle-orm";
import { db } from "../database";
import { BookGenderByBookInfoModel } from "../schemas/BookGenderByBookInfoModel";
import { GenderInterface } from "~/api/interfaces/GenderInterface";
import { BookGenderModel } from "../schemas/BookGenderModel";

export async function databaseSaveGendersByBook(genders: GenderInterface[], id_bookinfo: number) {
  const inserts = await db
    .insert(BookGenderModel)
    .values(
      genders.map(v => ({
        name: v.name,
        value: v.value,
      })),
    )
    .onConflictDoUpdate({
      target: BookGenderModel.value,
      set: {
        name: sql`excluded.name`,
      },
    })
    .returning({
      id: BookGenderModel.id,
    });

  await db
    .insert(BookGenderByBookInfoModel)
    .values(
      inserts.map(v => ({
        id_bookinfo: id_bookinfo,
        id_bookgender: v.id,
      })),
    )
    .onConflictDoNothing();
}