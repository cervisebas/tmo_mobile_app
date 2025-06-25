import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { databaseSaveChapterHistory } from "../scripts/databaseSaveChapterHistory";

export async function setDatabaseHistoryChapter(chapterList: ChapterInterface[], chapter: ChapterInterface, status: boolean) {
  const indexOf = chapterList.indexOf(chapter);

  if (indexOf === -1) {
    return;
  }
  
  if (status) {
    for (let i = indexOf; i < chapterList.length; i++) {
      const item = chapterList[i];
      
      await databaseSaveChapterHistory(item, true);
    }
  
    for (let i = 0; i < indexOf; i++) {
      const item = chapterList[i];
      
      await databaseSaveChapterHistory(item, false);
    }
  } else {
    for (let i = indexOf; i >= 0; i--) {
      const item = chapterList[i];
      
      await databaseSaveChapterHistory(item, false);
    }
  }
}