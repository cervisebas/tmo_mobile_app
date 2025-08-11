import { Observable } from "rxjs";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { LibraryQueriesInterface } from "../interfaces/LibraryQueriesInterface";
import { useApi } from "./useApi";
import { librarySearch } from "../scripts/librarySearch";
import { setDatabaseBooks } from "~/database/services/setDatabaseBooks";
import { clearSearchFilters } from "../utils/clearSearchFilters";
import { useRef, useState } from "react";
import { ApiEndpoint } from "../enums/ApiEndpoint";

export function useApiLibrarySearch(getFilters: (page: number) => Partial<LibraryQueriesInterface>) {
  const [url, setUrl] = useState(ApiEndpoint.LIBRARY as string);
  const [nextPage, setNextPage] = useState<number | undefined>(undefined);
  const page = useRef(1);

  const api = useApi<BookInfoInterface[]>(
    new Observable<BookInfoInterface[]>(function (sub) {
      librarySearch(clearSearchFilters(getFilters(page.current)))
        .then(async value => {
          setUrl(value.url);
          setNextPage(value.nextPage);

          sub.next(
            api.data
              ? value.books.filter(val => {
                const findIndex = api.data?.findIndex(f => f.path === val.path);
                return findIndex === -1;
              })
              : value.books,
          );

          sub.complete();
          
          setDatabaseBooks(value.books);
        })
        .catch(sub.error);
    }),
  );

  function goNextPage() {
    page.current = nextPage ?? 1;
    api.reloadAppend();
  }

  function fullReload() {
    page.current = 1;
    api.fullReload();
  }

  return {...api, url, fullReload, nextPage, goNextPage};
}
