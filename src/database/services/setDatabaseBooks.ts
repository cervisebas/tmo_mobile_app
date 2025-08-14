import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { DatabaseSave } from "../classes/DatabaseSave";

export async function setDatabaseBooks(data: BookInfoInterface[]) {
  try {
    const dbSave = new DatabaseSave();

    for (const item of data) {
      await dbSave.saveBook(item);
    }
  } catch (error) {
    console.error(error);
  }
}
