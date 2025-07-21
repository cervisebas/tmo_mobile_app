import { ChapterInterface } from "~/api/interfaces/ChapterInterface";

export interface ChapterVisualizerParams {
  index: number;
  title: string;
  images: string[];
  book_url: string;
  originUrl: string;
  chapter_id: string;
  chapters: ChapterInterface[];
}
