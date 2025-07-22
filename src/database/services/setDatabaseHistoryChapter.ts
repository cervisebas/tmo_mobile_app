import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { checkMarkUserBookStatus } from "./checkMarkUserBookStatus";
import { databaseSaveChaptersHistory } from "../scripts/databaseSaveChaptersHistory";

export async function setDatabaseHistoryChapter(
  id_bookinfo: number,
  chapterList: ChapterInterface[],
  chapter: ChapterInterface,
  status: boolean,
) {
  const isStatusMarked = await checkMarkUserBookStatus(id_bookinfo);

  if (!isStatusMarked && status) {
    throw 'Es necesario clasificar la obra en un estado para marcar los capítulos vistos.';
  }
  
  const indexOf = chapterList.indexOf(chapter);

  if (indexOf === -1) {
    return;
  }
  
  const chapter_set_list: Parameters<typeof databaseSaveChaptersHistory>[0] = [];

  for (const item of chapterList) {
    if (chapter.chapter_number >= item.chapter_number) {
      chapter_set_list.push({
        id_chapter: item.id!,
        //status: true,
        status:
          chapter.chapter_number === item.chapter_number
            ? status
            : true
        ,
      });
    } else {
      chapter_set_list.push({
        id_chapter: item.id!,
        status: false,
      });
    }
  }

  await databaseSaveChaptersHistory(chapter_set_list);

  return status;
}