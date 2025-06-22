export interface UserStatus {
  quantity: string;
  user_select: boolean;
}

export interface UserBookStatus {
  watch: UserStatus;
  pending: UserStatus;
  follow: UserStatus;
  wish: UserStatus;
  have: UserStatus;
  abandoned: UserStatus;
}
