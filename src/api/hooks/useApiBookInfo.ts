import { Observable } from "rxjs";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { useApi } from "./useApi";
import { getBookInfo } from "../scripts/getBookInfo";
import { DatabaseSave } from "~/database/classes/DatabaseSave";
import { DatabaseService } from "~/database/classes/DatabaseService";

const dbService = new DatabaseService();
export function useApiBookInfo(url: string, referer?: string) {
  return useApi<BookInfoInterface>(
    new Observable<BookInfoInterface>(function (sub) {
      dbService.getDatabaseBookInfo(url)
        .then(value => {
          if (value) {
            sub.next(value);
          }

          getBookInfo(url, referer)
            .then(async value => {
              const dbSave = new DatabaseSave();
              await dbSave.saveBook(value);

              const dbService = new DatabaseService();
              const data = await dbService.getDatabaseBookInfo(url);

              sub.next(data!);
              sub.complete();
            })
            .catch(err => {
              console.error(err);
              sub.error(err);
            });
        })
        .catch(err => {
          console.error(err);
          sub.error(err);
        });
    })
  );
}
