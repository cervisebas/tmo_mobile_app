import { ScrollLargeHeaderProps } from "@codeherence/react-native-header";
import { BookStatusPanel } from "./BookStatusPanel";
import { UserBookStatus } from "~/api/interfaces/UserBookStatus";

interface IProps extends ScrollLargeHeaderProps {
  status: UserBookStatus;
}

export function LargeHeader(props: IProps) {
  return (
    <BookStatusPanel
      {...props.status}
    />
  );
}
