import { useCallback, useEffect, useState } from "react";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { ChapterOptionInterface } from "~/api/interfaces/ChapterOptionInterface";
import { ChapterProgressStorage } from "../../chapter-progress";
import { useInterval } from "~/common/hooks/useInterval";
import { DatabaseSave } from "~/database/classes/DatabaseSave";

export function useAutoSaveChapterBookHistory(
  id_bookinfo: number,
  chapter: ChapterInterface,
  option: ChapterOptionInterface,
  getProgress: () => Promise<number | null | undefined>,
) {
  const [saving, setSaving] = useState(false);
  const [availableProgress, setAvailableProgress] = useState<number | null>(null);
  const CHAPTER_ID = option.path.slice(option.path.lastIndexOf('/') + 1);

  const saveNow = useCallback(async () => {
    setSaving(true);
    setAvailableProgress(null);
    
    try {
      const progress = await getProgress();

      if (!progress) {
        return;
      }

      ChapterProgressStorage.set(CHAPTER_ID, progress);

      const dbSave = new DatabaseSave();
      await dbSave.saveUserHistory(
        id_bookinfo,
        chapter,
        option,
        progress,
      );

      setSaving(false);
    } catch (error) {
      setSaving(false);
      console.error(error);
    }
  }, []);

  const interval = useInterval(saveNow, 2500, false);

  const checkAvailableProgress = useCallback(async () => {
    const info = ChapterProgressStorage.getNumber(CHAPTER_ID);

    if (info) {
      setAvailableProgress(info);
    } else {
      interval.start();
    }
  }, []);

  useEffect(() => {
    checkAvailableProgress();
  }, []);

  return {
    saving,
    availableProgress,
    saveNow,
    init() {
      interval.start();
    },
  };
}
