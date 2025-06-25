import { useCallback, useEffect, useState } from "react";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { ChapterHistoryInterface } from "../interfaces/ChapterHistoryInterface";
import { getDatabaseHistoryChapter } from "../services/getDatabaseHistoryChapter";
import { useTableChanges as useTableChange } from "./useTableChange";
import { BookChapterHistory } from "../schemas/BookChapterHistory";
import { DatabaseTable } from "../enums/DatabaseTable";

export function useChapterHistory(chapterList: ChapterInterface[]) {
  const [chapters, setChapters] = useState<ChapterHistoryInterface[]>([]);

  const processChapters = useCallback(async () => {
    console.log('find');
    const data: ChapterHistoryInterface[] = [];
    
    for (const chapter of chapterList) {
      data.push({
        ...chapter,
        viewed: await getDatabaseHistoryChapter(chapter.id!),
      });
    }

    setChapters(data);
  }, [chapterList]);

  useTableChange(
    DatabaseTable.BOOK_CHAPTER_HISTORY,
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
