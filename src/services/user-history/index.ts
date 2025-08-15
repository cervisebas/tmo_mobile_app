import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { DatabaseSave } from "~/database/classes/DatabaseSave";
import { DatabaseService } from "~/database/classes/DatabaseService";

const dbService = new DatabaseService();

async function addUserHistory(book: BookInfoInterface | number, chapter: ChapterInterface | number) {
  try {
    const id_bookinfo = typeof book === 'number' ? book : book.id;
    const id_chapter = typeof chapter === 'number' ? chapter : chapter.id;
    
    if (id_bookinfo !== undefined && id_chapter !== undefined) {
      const dbSave = new DatabaseSave();
      await dbSave.saveUserChapterHistory(id_bookinfo, id_chapter);
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeUserHistory(id: number) {
  return dbService.removeUserChapterHistory(id);
}

async function removeAllUserHistory() {
  return dbService.removeAllUserChapterHistory();
}

function allUserHistory() {
  return dbService.getAllUserChapterHistory();
}

export const UserHistory = {
  addUserHistory,
  allUserHistory,
  removeUserHistory,
  removeAllUserHistory,
};
