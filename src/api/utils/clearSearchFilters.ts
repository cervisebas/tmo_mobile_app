import { LibraryQueries } from "../enums/LibraryQueries";
import { LibraryQueriesInterface } from "../interfaces/LibraryQueriesInterface";

export function clearSearchFilters(queries: Partial<LibraryQueriesInterface>) {
  for (const [key, value] of Object.entries(queries)) {
    if (value === '-') {
      Object.assign(queries, {
        [key]: '',
      });
    }
  }

  if (queries[LibraryQueries.TITLE]) {
    Object.assign(queries, {
      [LibraryQueries.TITLE]:
        queries[LibraryQueries.TITLE]
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      ,
    });
  }

  return queries;
}