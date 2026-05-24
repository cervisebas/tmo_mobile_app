import { ChapterOptionInterface } from '~/api/interfaces/ChapterOptionInterface';

export function getBestOptionFromChapter(options: ChapterOptionInterface[]) {
  if (options.length === 1) {
    return options[0];
  }

  const bestOption = options.sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )[0];

  return bestOption;
}
