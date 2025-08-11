import { MMKV } from "react-native-mmkv";

export const ChapterProgressStorage = new MMKV({
  id: 'chapter-history-progress',
});
