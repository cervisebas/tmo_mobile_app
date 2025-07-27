import { useCallback, useEffect, useState } from "react";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { ChapterOptionInterface } from "~/api/interfaces/ChapterOptionInterface";
import { getBookChapterInfo } from "../services/getBookChapterInfo";
import { getCurrentHistoryBook } from "../services/getCurrentHistoryBook";
import { useTableChanges } from "./useTableChange";
import { DatabaseTableName } from "../enums/DatabaseTableName";

export function useUserChapterBookHistory(id_bookinfo: number) {
  const [chapter, setChapter] = useState<ChapterInterface | undefined>(undefined);
  const [option, setOption] = useState<ChapterOptionInterface | undefined>(undefined);

  const loadData = useCallback(async () => {
    const _info = await getCurrentHistoryBook(id_bookinfo);

    if (!_info) {
      return;
    }

    const _chapter = await getBookChapterInfo(_info.id_chapter);

    setChapter(_chapter);
    setOption(_chapter?.options.find(v => v.path === _info.path_option));
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useTableChanges(
    DatabaseTableName.BOOK_CHAPTER_HISTORY,
    loadData,
    [],
    0,
  );

  return {chapter, option};
}
