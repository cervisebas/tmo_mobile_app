import { LibraryGenders } from "../enums/LibraryGenders";
import { LibraryQueries, LibraryOrderItems, LibraryOrderDir, LibraryFilterby, LibraryType, LibraryDemography, LibraryStatus, LibraryTranslationStatus, LibraryCheck } from "../enums/LibraryQueries";

export interface LibraryQueriesInterface {
  // Order
  [LibraryQueries.ORDER_ITEM]: LibraryOrderItems;
  [LibraryQueries.ORDER_DIR]: LibraryOrderDir;

  // Search
  [LibraryQueries.TITLE]: string;
  [LibraryQueries.FILTER_BY]: LibraryFilterby;

  // Page number
  [LibraryQueries.PAGE]: string | number;

  // Filters
  [LibraryQueries.TYPE]: LibraryType;
  [LibraryQueries.DEMOGRAPHY]: LibraryDemography;
  [LibraryQueries.STATUS]: LibraryStatus;
  [LibraryQueries.TRANSLATION_STATUS]: LibraryTranslationStatus;
  [LibraryQueries.WEBCOMIC]: LibraryCheck;
  [LibraryQueries.YONKOMA]: LibraryCheck;
  [LibraryQueries.AMATEUR]: LibraryCheck;
  [LibraryQueries.EROTIC]: LibraryCheck;

  // Genders
  [LibraryQueries.GENDERS]: LibraryGenders[];
  [LibraryQueries.EXCLUDE_GENDERS]: LibraryGenders[];
}
