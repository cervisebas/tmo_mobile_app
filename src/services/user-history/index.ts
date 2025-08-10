import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { databaseSaveUserChapterHistory } from "~/database/scripts/databaseSaveUserChapterHistory";
import { getAllUserChapterHistory } from "~/database/services/getAllUserChapterHistory";
import { removeAllUserChapterHistory } from "~/database/services/removeAllUserChapterHistory";
import { removeUserChapterHistory } from "~/database/services/removeUserChapterHistory";

async function addUserHistory(book: BookInfoInterface | number, chapter: ChapterInterface | number) {
  try {
    const id_bookinfo = typeof book === 'number' ? book : book.id;
    const id_chapter = typeof chapter === 'number' ? chapter : chapter.id;
  
    if (id_bookinfo !== undefined && id_chapter !== undefined) {
      await databaseSaveUserChapterHistory(id_bookinfo, id_chapter);
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeUserHistory(id: number) {
  return removeUserChapterHistory(id);
}

async function removeAllUserHistory() {
  return removeAllUserChapterHistory();
}

function allUserHistory() {
  return getAllUserChapterHistory();
}

export const UserHistory = {
  addUserHistory,
  allUserHistory,
  removeUserHistory,
  removeAllUserHistory,
};
