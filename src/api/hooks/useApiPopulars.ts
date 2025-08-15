import { Observable } from "rxjs";
import { getAllPopulars } from "../scripts/getAllPopulars";
import { useApi } from "./useApi";
import { PopularsInterface } from "../interfaces/PopularsInterface";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { DatabaseService } from "~/database/classes/DatabaseService";

export function useApiPopulars() {
  return useApi<PopularsInterface>(
    new Observable<PopularsInterface>(function (sub) {
      getAllPopulars()
        .then(async value => {
          sub.next(value);
          sub.complete();
          
          const all = Object.values(value).flat() as BookInfoInterface[];
          const dbService = new DatabaseService();
          dbService.setDatabaseBooks(all);
        })
        .catch(sub.error);
    }),
  );
}
