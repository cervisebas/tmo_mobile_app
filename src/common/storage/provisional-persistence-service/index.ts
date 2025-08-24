import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { ProvisionalPersistenceBook } from "./interfaces/ProvisionalPersistenceBook";
import { UserBookStatus } from "~/api/enums/UserBookStatus";
import { ProvisionalPersistenceStorage } from "./constants/ProvisionalPersistenceStorage";
import { MMKV } from "react-native-mmkv";

export class ProvisionalPersistenceService {
  private storage: MMKV;

  constructor(useStorage?: MMKV) {
    this.storage = useStorage ?? ProvisionalPersistenceStorage;
  }

  public set(bookInfo: BookInfoInterface, userBookStatus: UserBookStatus | undefined) {
    console.info('Save book "%s" with status: %s', bookInfo.path, userBookStatus);

    if (!userBookStatus) {
      this.storage.delete(bookInfo.path);
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

    this.storage.set(
      bookInfo.path,
      JSON.stringify(use_data),
    );
  }

  public getAll() {
    const keys = this.storage.getAllKeys();
    const books: ProvisionalPersistenceBook[] = [];

    for (const key of keys) {
      const data = this.storage.getString(key);
      
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
  
  public getAllWithUserStatus(userBookStatus: UserBookStatus[]) {
    const all = this.getAll();

    return all.filter(val => (
      userBookStatus.includes(val.user_book_status)
    ));
  }

  public removeChapter(book_path: string, data_chapter: number) {
    const storage_data = this.storage.getString(book_path);

    if (!storage_data) {
      return;
    }

    const data = JSON.parse(storage_data) as ProvisionalPersistenceBook;
    data.chapters = data.chapters.filter(chapter => (chapter.data_chapter !== data_chapter));

    this.storage.set(book_path, JSON.stringify(data));
  }
}
