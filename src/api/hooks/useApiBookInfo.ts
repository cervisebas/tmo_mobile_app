import { Observable } from "rxjs";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { useApi } from "./useApi";
import { getDatabaseBookInfo } from "~/database/services/getDatabaseBookInfo";
import { getBookInfo } from "../scripts/getBookInfo";
import { databaseSaveBook } from "~/database/scripts/databaseSaveBook";

export function useApiBookInfo(url: string, referer?: string) {
  return useApi<BookInfoInterface>(
    new Observable<BookInfoInterface>(function (sub) {
      getDatabaseBookInfo(url)
        .then(value => {
          if (value) {
            sub.next(value);
          }

          getBookInfo(url, referer)
            .then(async value => {
              await databaseSaveBook(value);
              const data = await getDatabaseBookInfo(url);

              sub.next(data!);
              sub.complete();
            })
            .catch(sub.error);
        })
        .catch(sub.error);
    })
  );
}
