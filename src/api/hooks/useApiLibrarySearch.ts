import { Observable } from "rxjs";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { LibraryQueriesInterface } from "../interfaces/LibraryQueriesInterface";
import { useApi } from "./useApi";
import { librarySearch } from "../scripts/librarySearch";
import { setDatabaseBooks } from "~/database/services/setDatabaseBooks";
import { clearSearchFilters } from "../utils/clearSearchFilters";
import { useState } from "react";
import { ApiEndpoint } from "../enums/ApiEndpoint";

export function useApiLibrarySearch(getFilters: () => LibraryQueriesInterface) {
  const [url, setUrl] = useState(ApiEndpoint.LIBRARY as string);

  const api = useApi<BookInfoInterface[]>(
    new Observable<BookInfoInterface[]>(function (sub) {
      librarySearch(clearSearchFilters(getFilters()))
        .then(async value => {
          setUrl(value.url);
          sub.next(value.books);
          sub.complete();
          
          setDatabaseBooks(value.books);
        })
        .catch(sub.error);
    }),
  );

  return {...api, url};
}
