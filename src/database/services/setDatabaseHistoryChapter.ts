import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { db } from "../database";
import { BookChapterHistoryModel } from "../schemas/BookChapterHistoryModel";
import { checkMarkUserBookStatus } from "./checkMarkUserBookStatus";

function makeInBulk(
  values: {
    id_chapter: number;
    status: boolean;
  }[],
  on_conflict: boolean,
) {
  return db
    .insert(BookChapterHistoryModel)
    .values(values)
    .onConflictDoUpdate({
      target: BookChapterHistoryModel.id_chapter,
      set: {
        status: on_conflict,
      },
    });
}

export async function setDatabaseHistoryChapter(
  id_bookinfo: number,
  chapterList: ChapterInterface[],
  chapter: ChapterInterface,
  status: boolean,
) {
  const isStatusMarked = await checkMarkUserBookStatus(id_bookinfo);

  if (!isStatusMarked && status) {
    throw 'Es necesario clasificar la obra en un estado para marcar los capítulos vistos.';
  }
  
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