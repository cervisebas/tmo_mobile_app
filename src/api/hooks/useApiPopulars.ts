import { Observable } from "rxjs";
import { getAllPopulars } from "../scripts/getAllPopulars";
import { useApi } from "./useApi";
import { PopularsInterface } from "../interfaces/PopularsInterface";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { setDatabaseBooks } from "~/database/services/setDatabaseBooks";

export function useApiPopulars() {
  return useApi<PopularsInterface>(
    new Observable<PopularsInterface>(function (sub) {
      getAllPopulars()
        .then(async value => {
          sub.next(value);
          
          const all = Object.values(value).flat() as BookInfoInterface[];
          setDatabaseBooks(all);
        })
        .catch(sub.error);
    }),
  );
}
