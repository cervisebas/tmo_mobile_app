import React, { useCallback } from "react";
import { toast } from "sonner-native";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { BottomSheetOptionsInterface } from "~/common/components/BottomSheetOptions";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { ProvisionalPersistenceService } from "~/common/storage/provisional-persistence-service";
import { refDialog } from "~/common/utils/Ref";
import { DatabaseService } from "~/database/classes/DatabaseService";

export const TestRemoveChapter = React.memo(function () {
  const removeChapter = useCallback(async (book: BookInfoInterface, chapter: ChapterInterface) => {
    try {
      refDialog.current?.showLoading('Eliminando capítulo...');
      
      const dbService = new DatabaseService();
      const provisionalPersistenceService = new ProvisionalPersistenceService();

      provisionalPersistenceService.removeChapter(book.path, chapter.data_chapter);
      await dbService.removeDatabaseChapter(chapter.id!);

      toast.success('Capítulo eliminado correctamente');
    } catch (error) {
      console.error(error);
    } finally {
      refDialog.current?.showLoading(false);
    }
  }, []);

  const testRemoveChapter = useCallback(async () => {
    try {
      refDialog.current?.showLoading('Obteniendo libros guardados...');

      const dbService = new DatabaseService();
      const all = await dbService.getUserStatusBooks('all');

      if (!all.length) {
        refDialog.current?.showAlert({
          message: 'Guarda un libro en "Seguidos" o "Favoritos" primero',
          showOk: true,
        });
        return;
      }

      const books: BookInfoInterface[] = [];
      for (const book of all) {
        const info = await dbService.getDatabaseBookInfo(book.url);

        if (info) {
          books.push(info);
        }
      }

      const options: Record<string, BottomSheetOptionsInterface[]> = {};
      for (const book of books) {
        if (book.chapters) {
          Object.assign(options, {
            [book.title]: book.chapters?.map<BottomSheetOptionsInterface>(v => ({
              label: v.title,
              onPress() {
                if (v.id) {
                  removeChapter(book, v);
                }
              },
            })),
          });
        }
      }

      if (!Object.keys(options).length) {
        refDialog.current?.showAlert({
          message: 'No se encontraron capítulos para eliminar.',
          showOk: true,
        });
        return;
      }

      refDialog.current?.showBottomSheetOptions(
        'Elije un capitulo para borrar',
        options,
      );
    } catch (error) {
      console.error(error);
    } finally {
      refDialog.current?.showLoading(false);
    }
  }, []);

  return (
    <ItemWithIcon
      title={'Eliminar capítulo'}
      description={'Elimina un capitulo como prueba para verificar las actualizaciónes'}
      descriptionNumberOfLines={6}
      leftIcon={'note-remove-outline'}
      onPress={testRemoveChapter}
    />
  );
});