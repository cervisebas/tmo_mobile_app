import { Observable } from "rxjs";
import { useApi } from "~/api/hooks/useApi";
import { UserChapterHistoryInterface } from "~/database/interfaces/UserChapterHistoryInterface";
import { UserHistory } from "..";
import { DatabaseTableName } from "~/database/enums/DatabaseTableName";
import { useTableChanges } from "~/database/hooks/useTableChange";

export function useUserHistory() {
  const api = useApi(
    new Observable<UserChapterHistoryInterface[]>(function (sub) {
      UserHistory.allUserHistory()
        .then(val => sub.next(val))
        .catch(err => sub.error(err))
        .finally(() => sub.complete());
    }),
  );

  useTableChanges(
    DatabaseTableName.BOOK_USER_CHAPTER_HISTORY_MODEL,
    () => api.reload(),
    [],
    0,
  );

  return api;
}
