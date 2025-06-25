import { BookStatus } from "~/api/enums/BookStatus";

interface BookStatusItem {
  label: string;
  color: string;
}

export const BookStatusList: Record<BookStatus, BookStatusItem> = {
  [BookStatus.PUBLICANDOSE]: {
    label: BookStatus.PUBLICANDOSE,
    color: '#51a351',
  },
  [BookStatus.FINALIZADO]: {
    label: BookStatus.FINALIZADO,
    color: '#bd362f',
  },
  [BookStatus.CANCELADO]: {
    label: BookStatus.CANCELADO,
    color: '#f89406',
  },
  [BookStatus.EN_ESPERA]: {
    label: BookStatus.EN_ESPERA,
    color: '#2f96b4',
  },

  [BookStatus.PAUSADO]: {
    label: BookStatus.PAUSADO,
    color: '#ffffff',
  },
  [BookStatus.ACTIVO]: {
    label: BookStatus.ACTIVO,
    color: '#ffffff',
  },
  [BookStatus.ABANDONADO]: {
    label: BookStatus.ABANDONADO,
    color: '#ffffff',
  },
};
