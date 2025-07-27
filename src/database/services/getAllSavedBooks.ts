import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { db } from "../database";
import { BookInfoModel } from "../schemas/BookInfoModel";

export async function getAllSavedBooks(): Promise<BookInfoInterface[]> {
  const books = await db
    .select()
    .from(BookInfoModel);

  return books.map(value => ({
    id: value.id,
    path: value.path,
    url: value.url,
    title: value.title,
    picture: value.picture,
    stars: value.stars,
    type: value.type,
  }));
}