import { UserBookStatus } from "../enums/UserBookStatus";

export interface UserStatus {
  quantity: string;
  user_select: boolean;
}

export interface UserBookStatusList {
  [UserBookStatus.WATCH]: UserStatus;
  [UserBookStatus.PENDING]: UserStatus;
  [UserBookStatus.FOLLOW]: UserStatus;
  [UserBookStatus.WISH]: UserStatus;
  [UserBookStatus.HAVE]: UserStatus;
  [UserBookStatus.ABANDONED]: UserStatus;
}
