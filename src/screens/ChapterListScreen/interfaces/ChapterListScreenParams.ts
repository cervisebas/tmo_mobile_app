import { ChapterInterface } from "~/api/interfaces/ChapterInterface";

export interface ChapterListScreenParams {
  title: string;
  chapters: ChapterInterface[];
  book_url: string;
  id_bookinfo: number;
}
