import { ScrollLargeHeaderProps } from "@codeherence/react-native-header";
import { BookStatusPanel } from "./BookStatusPanel";
import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { useUserBookStatus } from "~/database/hooks/useUserBookStatus";
import { useCallback, useRef } from "react";
import { toast } from "sonner-native";
import { DatabaseService } from "~/database/classes/DatabaseService";

interface IProps extends ScrollLargeHeaderProps {
  id_bookinfo: number;
  status: UserBookStatusList;
}

export function LargeHeader(props: IProps) {
  const data = useUserBookStatus(props.id_bookinfo, props.status);
  const inProgress = useRef(false);

  const onToggleStatus = useCallback((key: keyof UserBookStatusList) => {
    if (inProgress.current) {
      return;
    }

    const dbService = new DatabaseService();
    
    inProgress.current = true;
    toast.promise(dbService.setMarkUserBookStatus(props.id_bookinfo, key), {
      loading: 'Espere por favor...',
      success(value: boolean) {
        inProgress.current = false;
        return `Se ha ${value ? 'marcado' : 'desmarcado'} correctamente`;
      },
      error() {
        inProgress.current = false;
        return `Ocurrio un error inesperado`;
      },
    });
  }, [props.id_bookinfo]);

  return (
    <BookStatusPanel
      {...data}
      onToggleStatus={onToggleStatus}
    />
  );
}
