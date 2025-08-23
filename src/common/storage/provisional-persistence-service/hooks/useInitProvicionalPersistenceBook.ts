import { useCallback, useEffect } from "react";
import { ProvisionalPersistenceService } from "..";
import { DatabaseService } from "~/database/classes/DatabaseService";
import { UserStatus } from "~/api/interfaces/UserBookStatus";
import { UserBookStatus } from "~/api/enums/UserBookStatus";

export function useInitProvicionalPersistenceBook() {
  const initNow = useCallback(async () => {
    const dbService = new DatabaseService();
    
    const localBooks = ProvisionalPersistenceService.getAll();
    const databaseBooks = await dbService.getUserStatusBooks('all');

    if (localBooks.length === databaseBooks.length) {
      return;
    }

    for (const dbBook of databaseBooks) {
      const databaseInfo = await dbService.getDatabaseBookInfo(dbBook.url);

      const userBookStatusList = Object.entries(databaseInfo?.user_status!) as [string, UserStatus][];
      const userBookStatus = userBookStatusList.find(([, value]) => value.user_select);

      if (databaseInfo) {
        ProvisionalPersistenceService.set(
          databaseInfo,
          userBookStatus?.[0] as UserBookStatus,
        );
      }
    }
  }, []);

  useEffect(() => {
    initNow();
  }, []);
}
