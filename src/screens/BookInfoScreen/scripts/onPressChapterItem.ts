import moment from "moment";
import { BottomSheetOptionsInterface } from "~/common/components/BottomSheetOptions";
import { ChapterHistoryInterface } from "~/database/interfaces/ChapterHistoryInterface";
import { goViewChapter } from "./goViewChapter";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { toast } from "sonner-native";
import { setDatabaseHistoryChapter } from "~/database/services/setDatabaseHistoryChapter";
import { refDialog } from "~/common/utils/Ref";

interface IProps {
  chapter: ChapterHistoryInterface | ChapterInterface;
  primaryColor: string;
  book_url: string;
  book_title?: string;
  id_bookinfo: number;
  chapters: ChapterInterface[];
}

export function onPressChapterItem(props: IProps) {
  const options: BottomSheetOptionsInterface[] = props.chapter.options.map((option, index) => ({
    label: option.title,
    description: moment(option.date).format('DD-MM-YYYY'),
    leftIcon: 'play',
    leftIconColor: props.primaryColor,
    onPress() {
      goViewChapter({
        index: index,
        option: option,
        chapter: props.chapter,
        book_url: props.book_url,
        id_bookinfo: props.id_bookinfo,
        chapters_list: props.chapters,
      });
    },
  }));

  const aditionalOptions: BottomSheetOptionsInterface[] = [];

  if ('viewed' in props.chapter) {
    aditionalOptions.push({
      label: props.chapter.viewed
        ? 'Marcar como no visto'
        : 'Marcar como visto'
      ,
      leftIcon: props.chapter.viewed
        ? 'eye-off-outline'
        : 'eye-outline'
      ,
      onPress() {
        toast.promise(setDatabaseHistoryChapter(
          props.id_bookinfo,
          props.chapters,
          props.chapter,
          !(props.chapter as ChapterHistoryInterface).viewed
        ), {
          loading: 'Espere por favor...',
          success(value: boolean) {
            return `Se ha ${value ? 'marcado' : 'desmarcado'} como visto correctamente`;
          },
          error(error) {
            return typeof error === 'string'
              ? error
              : 'Ocurrio un error inesperado';
          },
        });
      },
    });
  }

  const information: BottomSheetOptionsInterface[] = [
    {
      label: props.book_title
        ? 'Nombre del capítulo'
        : 'Nombre',
      leftIcon: 'text',
      description: props.chapter.title,
    },
  ];

  if (props.book_title) {
    information.unshift({
      label: 'Nombre del libro',
      leftIcon: 'book-outline',
      description: props.book_title,
    });
  }

  refDialog.current?.showBottomSheetOptions(
    'Opciónes del capítulo',
    {
      'Información': information,
      'Opciónes de lectura': options,
      ...(
        aditionalOptions.length
           ? {
             'Opciónes adicionales': aditionalOptions,
           }
           : {}
      )
    },
  );
}
