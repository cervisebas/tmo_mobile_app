import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";

export interface UserChapterHistoryInterface {
  id: number;
  date: Date;
  book: BookInfoInterface;
  chapter: ChapterInterface;
}
