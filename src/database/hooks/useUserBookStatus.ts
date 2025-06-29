import { useCallback, useState } from "react";
import { UserBookStatusList } from "../../api/interfaces/UserBookStatus";
import { DatabaseTable } from "../enums/DatabaseTable";
import { useTableChanges } from "./useTableChange";
import { getMarkUserBookStatus } from "../services/getMarkUserBookStatus";

export function useUserBookStatus(id_bookinfo: number, userBookStatus: UserBookStatusList) {
  const [data, setData] = useState(userBookStatus);
  
  const loadUserStatus = useCallback(
    async () => {
      const bookStatus = await getMarkUserBookStatus(id_bookinfo);

      setData(bookStatus);
    },
    [id_bookinfo],
  );

  useTableChanges(
    DatabaseTable.BOOK_USER_STATUS_BY_BOOK_INFO,
    loadUserStatus,
    [id_bookinfo],
  );

  return data;
}
