import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { db } from "../database";
import { BookChapterHistory } from "../schemas/BookChapterHistory";

function makeInBulk(
  values: {
    id_chapter: number;
    status: boolean;
  }[],
  on_conflict: boolean,
) {
  return db
    .insert(BookChapterHistory)
    .values(values)
    .onConflictDoUpdate({
      target: BookChapterHistory.id_chapter,
      set: {
        status: on_conflict,
      },
    });
}

export async function setDatabaseHistoryChapter(chapterList: ChapterInterface[], chapter: ChapterInterface, status: boolean) {
  const indexOf = chapterList.indexOf(chapter);

  if (indexOf === -1) {
    return;
  }
  
  if (status) {
    // Set True
    const listOfTrue = chapterList.splice(indexOf);

    if (listOfTrue.length) {
      await makeInBulk(
        listOfTrue.map(v => ({
          id_chapter: v.id!,
          status: true,
        })),
        true,
      );
    }

    // Set False
    const listOfFalse = chapterList.splice(0, indexOf);

    if (listOfFalse.length) {
      await makeInBulk(
        listOfFalse.map(v => ({
          id_chapter: v.id!,
          status: true,
        })),
        false,
      );
    }
  } else {
    const listOfFalse = chapterList.splice(0, indexOf + 1);

    if (listOfFalse.length) {
      await makeInBulk(
        listOfFalse.map(v => ({
          id_chapter: v.id!,
          status: true,
        })),
        false,
      );
    }
  }
}