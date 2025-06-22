import { BookStatus } from "../enums/BookStatus";
import { BookType } from "../enums/BookType";
import { ChapterInterface } from "./ChapterInterface";
import { GenderInterface } from "./GenderInterface";

export interface BookInfoInterface {
  path: string;
  url: string;
  title: string;
  picture: string;
  stars: number;
  type: BookType;

  status?: BookStatus;
  description?: string;
  wallpaper?: string;
  subtitle?: string;

  genders?: GenderInterface[];
  chapters?: ChapterInterface[];
}
