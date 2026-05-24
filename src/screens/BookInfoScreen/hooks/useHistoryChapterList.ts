import { useMemo } from 'react';
import { ChapterInterface } from '~/api/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '~/api/interfaces/ChapterOptionInterface';

export type ItemListChapter = [
  ChapterInterface | undefined,
  ChapterOptionInterface | undefined,
];

export function useHistoryChapterList(
  currentChapter?: ChapterInterface,
  chapterList?: ChapterInterface[],
  currentOption?: ChapterOptionInterface,
) {
  const nextChapter = useMemo(() => {
    const chapter_list = chapterList?.sort(
      (a, b) => a.chapter_number - b.chapter_number,
    );
    const current = chapter_list?.findIndex(
      (val) => val?.id === currentChapter?.id,
    );

    return chapter_list?.at((current || 0) + 1);
  }, [currentChapter, chapterList]);

  const nextChapterOption = useMemo(() => {
    const findSameOption = nextChapter?.options.find(
      (option) => option.title === currentOption?.title,
    );

    return findSameOption;
  }, [nextChapter, currentOption]);

  const itemListChapter = useMemo(() => {
    const items: ItemListChapter[] = [[currentChapter, currentOption]];

    if (nextChapter) {
      items.push([nextChapter, nextChapterOption]);
    }

    return items;
  }, [currentChapter, nextChapter, nextChapterOption]);

  return { itemListChapter, nextChapterOption };
}
