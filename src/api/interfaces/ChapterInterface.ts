import { ChapterOptionInterface } from "./ChapterOptionInterface";

export interface ChapterInterface {
  id?: number;
  title: string;
  data_chapter: number;
  options: ChapterOptionInterface[];
}
