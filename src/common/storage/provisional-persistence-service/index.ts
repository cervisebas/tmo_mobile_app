import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { ProvisionalPersistenceBook } from "./interfaces/ProvisionalPersistenceBook";
import { UserBookStatus } from "~/api/enums/UserBookStatus";
import { ProvisionalPersistenceStorage } from "./constants/ProvisionalPersistenceStorage";

export class ProvisionalPersistenceService {
  public static set(bookInfo: BookInfoInterface, userBookStatus: UserBookStatus | undefined) {
    if (!userBookStatus) {
      ProvisionalPersistenceStorage.delete(bookInfo.path);
      return;
    }

    const chapters = bookInfo.chapters ?? [];
    const use_data: ProvisionalPersistenceBook = {
      id: bookInfo.id!,
      url: bookInfo.url,
      title: bookInfo.title,
      status: bookInfo.status!,
      user_book_status: userBookStatus,
      chapters: chapters.map(chapter => ({
        data_chapter: chapter.data_chapter,
      })),
    };

    ProvisionalPersistenceStorage.set(
      bookInfo.path,
      JSON.stringify(use_data),
    );
  }

  public static getAll() {
    const keys = ProvisionalPersistenceStorage.getAllKeys();
    const books: ProvisionalPersistenceBook[] = [];

    for (const key of keys) {
      const data = ProvisionalPersistenceStorage.getString(key);
      
      if (data) {
        books.push(
          JSON.parse(
            data,
          ),
        );
      }
    }

    return books;
  }
  
  public static getAllWithUserStatus(userBookStatus: UserBookStatus[]) {
    const all = ProvisionalPersistenceService.getAll();

    return all.filter(val => (
      userBookStatus.includes(val.user_book_status)
    ));
  }
}
