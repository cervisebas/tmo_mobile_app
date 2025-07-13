import { ChapterOptionInterface } from "./ChapterOptionInterface";

export interface ChapterInterface {
  id?: number;
  title: string;
  chapter_number: number;
  data_chapter: number;
  options: ChapterOptionInterface[];
}
