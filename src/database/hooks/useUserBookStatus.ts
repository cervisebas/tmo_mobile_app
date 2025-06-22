import { UserBookStatus } from "../../api/interfaces/UserBookStatus";

export function useUserBookStatus(path_bookinfo: string) {
  const data: UserBookStatus = {
    watch: {
      quantity: "10K",
      user_select: false
    },
    pending: {
      quantity: "10K",
      user_select: false
    },
    follow: {
      quantity: "10K",
      user_select: false
    },
    wish: {
      quantity: "10K",
      user_select: false
    },
    have: {
      quantity: "10K",
      user_select: false
    },
    abandoned: {
      quantity: "10K",
      user_select: false
    },
  };

  return data;
}
