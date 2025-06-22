import { ChapterOptionInterface } from "./ChapterOptionInterface";

export interface ChapterInterface {
  id?: number;
  title: string;
  options: ChapterOptionInterface[];
}
