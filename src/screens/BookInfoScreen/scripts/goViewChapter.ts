import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { ChapterOptionInterface } from "~/api/interfaces/ChapterOptionInterface";
import { getImagesOfChapter } from "~/api/scripts/getImagesOfChapter";
import { refDialog, refNavigation } from "~/common/utils/Ref";
import { StackScreens } from "~/enums/StackScreens";
import { ChapterVisualizerParams } from "~/screens/ChapterVisualizerScreen/interfaces/ChapterVisualizerParams";

interface IProps {
  index: number;
  option: ChapterOptionInterface;
  chapter: ChapterInterface;
  book_url: string;
  id_bookinfo: number;
  chapters_list: ChapterInterface[];
  onLoadImages?(): Promise<void> | void;
}

export async function goViewChapter(props: IProps) {
  try {
    refDialog.current?.showLoading('Obteniendo información...');

    const {images, originUrl} = await getImagesOfChapter(
      props.option.path,
      props.book_url,
    );

    if (props.onLoadImages) {
      await props.onLoadImages();
    }

    const chapter_id = props.option.path.slice(props.option.path.lastIndexOf('/') + 1);
    const params: ChapterVisualizerParams = {
      index: props.index,
      title: props.chapter.title,
      images: images,
      book_url: props.book_url,
      originUrl: originUrl,
      chapter_id: chapter_id,
      chapter: props.chapter,
      chapter_list: props.chapters_list,
      id_bookinfo: props.id_bookinfo,
      selected_option: props.option,
    };

    refNavigation.current?.navigate(
      StackScreens.CHAPTER_VISUALIZER,
      params,
    );

    refDialog.current?.showLoading(false);
  } catch (error) {
    refDialog.current?.showLoading(false);
    refDialog.current?.showAlert({
      message: String(error),
      showOk: true,
    });
  }
}
