import { BookStatus } from "../enums/BookStatus";
import { BookType } from "../enums/BookType";
import { ChapterInterface } from "./ChapterInterface";
import { GenderInterface } from "./GenderInterface";
import { UserBookStatusList } from "./UserBookStatus";

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

  user_status?: UserBookStatusList;

  genders?: GenderInterface[];
  chapters?: ChapterInterface[];
}
