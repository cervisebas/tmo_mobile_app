import { BookStatus } from "../enums/BookStatus";
import { BookType } from "../enums/BookType";
import { ChapterInterface } from "./ChapterInterface";
import { GenderInterface } from "./GenderInterface";
import { UserBookStatus } from "./UserBookStatus";

export interface BookInfoInterface {
  id?: number;

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

  user_status?: UserBookStatus;

  genders?: GenderInterface[];
  chapters?: ChapterInterface[];
}
