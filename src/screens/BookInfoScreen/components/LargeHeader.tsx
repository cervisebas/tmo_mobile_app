import { ScrollLargeHeaderProps } from "@codeherence/react-native-header";
import { BookStatusPanel } from "./BookStatusPanel";
import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { useUserBookStatus } from "~/database/hooks/useUserBookStatus";
import { useCallback } from "react";
import { setMarkUserBookStatus } from "~/database/services/setMarkUserBookStatus";
import { refDialog } from "~/common/utils/Ref";
import { waitTo } from "~/common/utils/WaitTo";

interface IProps extends ScrollLargeHeaderProps {
  id_bookinfo: number;
  status: UserBookStatusList;
}

export function LargeHeader(props: IProps) {
  const data = useUserBookStatus(props.id_bookinfo, props.status);

  const onToggleStatus = useCallback(async (key: keyof UserBookStatusList) => {
    try {
      refDialog.current?.showLoading('Espere por favor...')
      
      await setMarkUserBookStatus(props.id_bookinfo, key);
      await waitTo(500);

      refDialog.current?.showLoading(false);
    } catch {
      refDialog.current?.showLoading(false);
    }
  }, [props.id_bookinfo]);

  return (
    <BookStatusPanel
      {...data}
      onToggleStatus={onToggleStatus}
    />
  );
}
