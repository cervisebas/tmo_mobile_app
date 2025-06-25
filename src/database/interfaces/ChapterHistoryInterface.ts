import { ChapterInterface } from "~/api/interfaces/ChapterInterface";

export interface ChapterHistoryInterface extends ChapterInterface {
  viewed: boolean;
}