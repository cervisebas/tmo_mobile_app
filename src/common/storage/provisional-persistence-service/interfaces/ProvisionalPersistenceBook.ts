import { BookStatus } from "~/api/enums/BookStatus";
import { UserBookStatus } from "~/api/enums/UserBookStatus";

export interface ProvisionalPersistenceBook {
  id: number;
  url: string;
  title: string;
  status: BookStatus;
  user_book_status: UserBookStatus;
  chapters: {
    data_chapter: number;
  }[];
}
