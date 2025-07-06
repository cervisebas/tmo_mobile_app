export enum LibraryOrderItems {
  LIKES_COUNT = 'likes_count',
  ALPHABETICALLY = 'alphabetically',
  SCORE = 'score',
  CREATION = 'creation',
  RELEASE_DATE = 'release_date',
  NUM_CHAPTERS = 'num_chapters',
}

export enum LibraryOrderDir {
  ASC = 'asc',
  DESC = 'desc',
}

export enum LibraryFilterby {
  TITLE = 'title',
  AUTHOR = 'author',
  COMPANY = 'company',
}

export enum LibraryType {
  ALL = '-',
  MANGA = 'manga',
  MANHUA = 'manhua',
  MANHWA = 'manhwa',
  NOVEL = 'novel',
  ONE_SHOT = 'one_shot',
  DOUJINSHI = 'doujinshi',
  OEL = 'oel',
}

export enum LibraryDemography {
  ALL = '-',
  SEINEN = 'seinen',
  SHOUJO = 'shoujo',
  SHOUNEN = 'shounen',
  JOSEI = 'josei',
  KODOMO = 'kodomo',
}

export enum LibraryStatus {
  ALL = "",
  PUBLISHING = "publishing",
  ENDED = "ended",
  CANCELLED = "cancelled",
  ON_HOLD = "on_hold",
}

export enum LibraryTranslationStatus {
  ALL = '-',
  ACTIVE = 'active',
  FINISHED = 'finished',
  ABANDONED = 'abandoned',
}

export enum LibraryCheck {
  ALL = '-',
  YES = 'true',
  NO = 'false',
}

export enum LibraryQueries {
  // Order
  ORDER_ITEM = 'order_item',
  ORDER_DIR = 'order_dir',

  // Search
  TITLE = 'title',
  FILTER_BY = 'filter_by',

  // Page number
  PAGE = '_pg',

  // Filters
  TYPE = 'type',
  DEMOGRAPHY = 'demography',
  STATUS = 'status',
  TRANSLATION_STATUS = 'translation_status',
  WEBCOMIC = 'webcomic',
  YONKOMA = 'yonkoma',
  AMATEUR = 'amateur',
  EROTIC = 'erotic',

  // Genders
  GENDERS = 'genders',
  EXCLUDE_GENDERS = 'exclude_genders',
}
