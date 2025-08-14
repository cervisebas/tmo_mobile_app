import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { BookInfoInterface } from "~/api/interfaces/BookInfoInterface";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { ChapterOptionInterface } from "~/api/interfaces/ChapterOptionInterface";
import { BottomSheetOptionsInterface } from "~/common/components/BottomSheetOptions";
import { ShareURL } from "~/common/scripts/ShareURL";
import { refDialog } from "~/common/utils/Ref";
import { DatabaseService } from "~/database/classes/DatabaseService";

interface IProps {
  chapter: ChapterInterface;
  selectedOption: ChapterOptionInterface;
  nextChapter?: ChapterInterface | null;
  previusChapter?: ChapterInterface | null;
  book_url: string;

  goToChapter(move: number): void;
}

export interface VisualizerOptionsSheetRef {
  open(): void;
}

export const VisualizerOptionsSheet = React.memo(forwardRef(
  function (props: IProps, ref: React.Ref<VisualizerOptionsSheetRef>) {
    const [bookInfo, setBookInfo] = useState<BookInfoInterface | null>(null);

    useEffect(() => {
      const dbService = new DatabaseService();
      dbService.getDatabaseBookInfo(props.book_url)
        .then(setBookInfo);
    }, [props.book_url]);

    useImperativeHandle(ref, ()=> ({
      open() {
        const infoSection: BottomSheetOptionsInterface[] = [
          {
            label: 'Capítulo',
            leftIcon: 'book-open-page-variant-outline',
            description: props.chapter.title,
          },
          {
            label: 'Traductor',
            leftIcon: 'translate',
            description: props.selectedOption.title,
          },
          {
            label: 'Compartir capitulo',
            leftIcon: 'share-variant-outline',
            onPress() {
              ShareURL(props.selectedOption.path);
            },
          }
        ];

        if (bookInfo) {
          infoSection.unshift(
            {
              label: 'Libro',
              leftIcon: 'book-outline',
              description: bookInfo.title,
            },
            {
              label: 'Compartir libro',
              leftIcon: 'share-variant-outline',
              onPress() {
                ShareURL(bookInfo.url);
              },
            },
          );
        }

        const actionSection: BottomSheetOptionsInterface[] = [];

        if (props.previusChapter) {
          actionSection.push({
            label: 'Anterior capítulo',
            leftIcon: 'arrow-left',
            description: props.previusChapter?.title,
            disabled: !props.previusChapter,
            onPress() {
              props.goToChapter(-1);
            },
          });
        }
        if (props.nextChapter) {
          actionSection.push({
            label: 'Siguiente capítulo',
            leftIcon: 'arrow-right',
            description: props.nextChapter?.title,
            disabled: !props.nextChapter,
            onPress() {
              props.goToChapter(1);
            },
          });
        }

        refDialog.current?.showBottomSheetOptions(
          'Opciones',
          {
            'Viendo ahora': infoSection,
            'Acciones': actionSection,
          },
        );
      },
    }));

    return (
      <React.Fragment />
    );
  }
));