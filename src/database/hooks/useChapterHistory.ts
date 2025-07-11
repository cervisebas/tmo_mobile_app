import { useCallback, useEffect, useState } from "react";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { ChapterHistoryInterface } from "../interfaces/ChapterHistoryInterface";
import { getDatabaseHistoryChapter } from "../services/getDatabaseHistoryChapter";
import { useTableChanges as useTableChange } from "./useTableChange";
import { DatabaseTableName } from "../enums/DatabaseTableName";

export function useChapterHistory(chapterList: ChapterInterface[]) {
  const [chapters, setChapters] = useState<ChapterHistoryInterface[]>([]);

  const processChapters = useCallback(async () => {
    const data: ChapterHistoryInterface[] = [];

    const hystory = await getDatabaseHistoryChapter(chapterList.map(v => v.id!));
    
    for (const chapter of chapterList) {
      const viewed = hystory.find(v => v.id === chapter.id);
      
      data.push({
        ...chapter,
        viewed: viewed ? viewed.status : false,
      });
    }

    setChapters(data);
  }, [chapterList]);

  useTableChange(
    DatabaseTableName.BOOK_CHAPTER_HISTORY,
    processChapters,
    [chapterList],
  );

  useEffect(() => {
    processChapters();
  }, [chapterList]);

  useEffect(() => {
    processChapters();
  }, []);

  return chapters;
}
