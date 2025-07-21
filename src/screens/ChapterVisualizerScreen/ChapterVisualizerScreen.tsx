import { Appbar } from "react-native-paper";
import PrincipalView from "~/common/components/PrincipalView";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import { ChapterVisualizerParams } from "./interfaces/ChapterVisualizerParams";
import { VisualizeWebView, VisualizeWebViewRef } from "./components/VisualizeWebView";
import { useLoadChapterImages } from "./hooks/useLoadChapterImages";
import { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import { goViewChapter } from "../BookInfoScreen/scripts/goViewChapter";

export function ChapterVisualizerScreen(props: StackScreenProps) {
  const params = props.route.params as ChapterVisualizerParams;

  const refVisualizeWebView = useRef<VisualizeWebViewRef>(null);
  const progressRef = useRef<string | number | undefined>(undefined);

  const {images, startLoadImages, cancelLoad} = useLoadChapterImages(
    params.images,
    params.originUrl,
    params.chapter_id,
    (index, image) => refVisualizeWebView.current?.loadImage(index, image),
    (current, max) => {
      progressRef.current = toast.loading(
        `Cargando imagenes: ${current} de ${max}`,
        {
          id: progressRef.current,
          dismissible: false,
          duration: 1000000,
        },
      );

      if (current === max && progressRef.current) {
        toast.dismiss(progressRef.current);
      }
    },
  );

  const goToChapter = useCallback((move: number) => {
    const chapter_list = params.chapters.sort((a, b) => a.chapter_number - b.chapter_number);
    const index = params.index + move;
    const chapter = chapter_list.at(index)!;
    const bestOption = chapter.options.sort((a, b) => b.date.getTime() - a.date.getTime())[0];

    goViewChapter({
      index: index,
      option: bestOption,
      chapter: chapter,
      book_url: params.book_url,
      chapters_list: params.chapters,
      onLoadImages() {
        props.navigation.goBack();
      },
    });
  }, []);

  useEffect(() => {
    return () => {
      if (progressRef.current) {
        cancelLoad();
        toast.dismiss(progressRef.current);
      }
    };
  }, []);

  return (
    <PrincipalView>
      <Appbar.Header elevated>
        <Appbar.BackAction
          onPress={props.navigation.goBack}
        />
        <Appbar.Content
          title={params.title}
        />
        <Appbar.Action
          icon={'arrow-left'}
          disabled={!params.chapters[params.index - 1]}
          onPress={() => goToChapter(-1)}
          />
        <Appbar.Action
          icon={'arrow-right'}
          disabled={!params.chapters[params.index + 1]}
          onPress={() => goToChapter(1)}
        />
      </Appbar.Header>

      <View className={'flex-1'}>
        <VisualizeWebView
          ref={refVisualizeWebView}
          images={images}
          bookPath={params.chapter_id}
          onLoadEnd={startLoadImages}
        />
      </View>
    </PrincipalView>
  );
}