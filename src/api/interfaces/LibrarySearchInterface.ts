import { BookInfoInterface } from "./BookInfoInterface";

export interface LibrarySearchInterface {
  url: string;
  books: BookInfoInterface[];
  nextPage?: number;
}
