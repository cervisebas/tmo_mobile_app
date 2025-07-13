const extract_number_chapter = /Capítulo\s+(\d+(\.\d+)?)/;

export function extractNumberChapter(title: string) {
  return Number(title.match(extract_number_chapter)?.[1] ?? -1);
}
