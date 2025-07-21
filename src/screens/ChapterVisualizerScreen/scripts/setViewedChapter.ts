import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { getDatabaseHistoryChapter } from "~/database/services/getDatabaseHistoryChapter";
import { setDatabaseHistoryChapter } from "~/database/services/setDatabaseHistoryChapter";

export async function setViewedChapter(
  id_bookinfo: number,
  chapterList: ChapterInterface[],
  chapter: ChapterInterface,
  status: boolean,
) {
  const is_viewed = await getDatabaseHistoryChapter(chapter.id!);

  if (!is_viewed) {
    await setDatabaseHistoryChapter(
      id_bookinfo,
      chapterList,
      chapter,
      status,
    );
  }
}