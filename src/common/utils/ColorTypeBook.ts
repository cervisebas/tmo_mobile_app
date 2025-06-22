import { BookType } from "~/api/enums/BookType";

export function getColorTypeBook(type: BookType) {
  switch (type) {
    case BookType.MANGA:
      return '#7986cb';

    case BookType.MANHUA:
      return '#8d6e63';

    case BookType.MANHWA:
      return '#81c784';

    case BookType.NOVELA:
      return '#e57373';

    case BookType.ONE_SHOT:
      return '#f06292';

    case BookType.DOUJINSHI:
      return '#ffb74d';

    case BookType.OEL:
      return '#ba68c8';

    default:
      return '#ffffff';
  }
}
