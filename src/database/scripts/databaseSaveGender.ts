import { GenderInterface } from "~/api/interfaces/GenderInterface";
import { db } from "../database";
import { BookGenderModel } from "../schemas/BookGenderModel";
import { eq } from "drizzle-orm";

export async function databaseSaveGender(data: GenderInterface) {
  const find = await db
    .select()
    .from(BookGenderModel)
    .where(eq(BookGenderModel.value, data.value));

  if (!find.length) {
    const insert = await db.insert(BookGenderModel).values({
      name: data.name,
      value: data.value,
    });

    return insert.lastInsertRowId;
  }

  return find.at(0)!.id;
}