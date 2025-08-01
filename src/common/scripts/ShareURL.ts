import { Share, Platform } from "react-native";

export function ShareURL(url: string) {
  Share.share(
    Platform.select({
      ios: {
        url: url,
      },
      default: {
        message: url,
      },
    }),
  );
}