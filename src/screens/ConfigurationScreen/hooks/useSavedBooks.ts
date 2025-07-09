import { useCallback, useEffect, useState } from "react";
import { db } from "~/database/database";
import { DatabaseTable } from "~/database/enums/DatabaseTable";
import { useTableChanges } from "~/database/hooks/useTableChange";
import { BookInfoModel } from "~/database/schemas/BookInfoModel";

export function useSavedBooks() {
  const [booksWithoutInfo, setBooksWithoutInfo] = useState(0);
  const [booksWithInfo, setBooksWithInfo] = useState(0);

  const loadData = useCallback(async () => {
    const all_books = await db.select().from(BookInfoModel);

    let booksWithoutInfo = 0;
    let booksWithInfo = 0;

    for (const book of all_books) {
      if (book.wallpaper) {
        booksWithInfo++;
        continue;
      }

      booksWithoutInfo++;
    }

    setBooksWithInfo(booksWithInfo);
    setBooksWithoutInfo(booksWithoutInfo);
  }, []);

  useTableChanges(
    DatabaseTable.BOOKS_INFO,
    loadData,
  );

  useEffect(() => {
    loadData();
  }, []);

  return {
    booksWithoutInfo,
    booksWithInfo,
  };
}
