import { databaseSaveBook } from "../scripts/databaseSaveBook";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";

export async function setDatabaseBooks(data: BookInfoInterface[]) {
  try {
    for (const item of data) {
      await databaseSaveBook(item);
    }
  } catch (error) {
    console.error(error);
  }
}
