import { useCallback, useEffect, useState } from "react";
import { UserBookStatus } from "~/api/enums/UserBookStatus";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { DatabaseTableName } from "~/database/enums/DatabaseTableName";
import { useTableChanges } from "~/database/hooks/useTableChange";
import { getUserStatusBooks } from "~/database/services/getUserStatusBooks";
import { getUserStatusCount } from "~/database/services/getUserStatusCount";

export function useProfileBooks(select: UserBookStatus) {
  const [stateList, setStateList] = useState<UserBookStatusList>({
    [UserBookStatus.WATCH]: {
      quantity: '0',
      user_select: false,
    },
    [UserBookStatus.PENDING]: {
      quantity: '0',
      user_select: false,
    },
    [UserBookStatus.FOLLOW]: {
      quantity: '0',
      user_select: false,
    },
    [UserBookStatus.WISH]: {
      quantity: '0',
      user_select: false,
    },
    [UserBookStatus.HAVE]: {
      quantity: '0',
      user_select: false,
    },
    [UserBookStatus.ABANDONED]: {
      quantity: '0',
      user_select: false,
    },
  });

  const [books, setBooks] = useState<BookInfoInterface[]>([]);


  const calculate = useCallback(async () => {
    const state_list = await getUserStatusCount();

    setStateList({
      ...state_list,
      [select]: {
        ...state_list[select],
        user_select: true,
      },
    });

    setBooks(await getUserStatusBooks(select));
  }, [select]);

  useEffect(() => {
    calculate();
  }, []);
  
  useEffect(() => {
    calculate();
  }, [select]);

  useTableChanges(
    DatabaseTableName.BOOK_USER_STATUS_BY_BOOK_INFO,
    calculate,
    [select],
    0,
  );

  return {stateList, books};
}