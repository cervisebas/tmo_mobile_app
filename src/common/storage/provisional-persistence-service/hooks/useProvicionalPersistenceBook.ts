import { useCallback, useEffect } from "react";
import { UserBookStatus } from "~/api/enums/UserBookStatus";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { ProvisionalPersistenceService } from "..";
import { getDatabaseBookInfo } from "~/database/services/getDatabaseBookInfo";
import { UserStatus } from "~/api/interfaces/UserBookStatus";

export function useProvicionalPersistenceBook(book: BookInfoInterface | null) {
  const saveProvisionalInfo = useCallback(async () => {
    if (!book) {
      return;
    }

    const provisionalPersistenceService = new ProvisionalPersistenceService();
    const databaseInfo = await getDatabaseBookInfo(book.url);

    if (databaseInfo) {
      const userBookStatusList = Object.entries(databaseInfo.user_status!) as [string, UserStatus][];
      const userBookStatus = userBookStatusList.find(([, value]) => value.user_select);

      provisionalPersistenceService.set(
        databaseInfo,
        userBookStatus?.[0] as UserBookStatus,
      );
    }
  }, [book]);

  useEffect(() => {
    saveProvisionalInfo();
  }, [book]);

  useEffect(() => {
    saveProvisionalInfo();
  }, []);
}
