import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { DatabaseService } from "~/database/classes/DatabaseService";

export async function setViewedChapter(
  id_bookinfo: number,
  chapterList: ChapterInterface[],
  chapter: ChapterInterface,
  status: boolean,
) {
  const dbService = new DatabaseService();
  const is_viewed = await dbService.getDatabaseHistoryChapter(chapter.id!);

  if (!is_viewed) {
    await dbService.setDatabaseHistoryChapter(
      id_bookinfo,
      chapterList,
      chapter,
      status,
    );
  }
}