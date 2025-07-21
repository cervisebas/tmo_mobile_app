import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { ChapterOptionInterface } from "~/api/interfaces/ChapterOptionInterface";
import { getImagesOfChapter } from "~/api/scripts/getImagesOfChapter";
import { refDialog, refNavigation } from "~/common/utils/Ref";
import { StackScreens } from "~/enums/StackScreens";

interface IProps {
  index: number;
  option: ChapterOptionInterface;
  chapter: ChapterInterface;
  book_url: string;
  chapters_list: ChapterInterface[];
  onLoadImages?(): void;
}

export async function goViewChapter(props: IProps) {
  try {
    refDialog.current?.showLoading('Obteniendo información...');

    const {images, originUrl} = await getImagesOfChapter(
      props.option.path,
      props.book_url,
    );

    props.onLoadImages?.();

    const chapter_id = props.option.path.slice(props.option.path.lastIndexOf('/') + 1);
    refNavigation.current?.navigate(
      StackScreens.CHAPTER_VISUALIZER,
      {
        index: props.index,
        title: props.chapter.title,
        images: images,
        book_url: props.book_url,
        originUrl: originUrl,
        chapter_id: chapter_id,
        chapters: props.chapters_list,
      },
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
