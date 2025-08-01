import { Appbar } from "react-native-paper";
import PrincipalView from "~/common/components/PrincipalView";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import { ChapterVisualizerParams } from "./interfaces/ChapterVisualizerParams";
import { VisualizeWebView, VisualizeWebViewRef } from "./components/VisualizeWebView";
import { useLoadChapterImages } from "./hooks/useLoadChapterImages";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import { goViewChapter } from "../BookInfoScreen/scripts/goViewChapter";
import { setViewedChapter } from "./scripts/setViewedChapter";
import { useAutoSaveChapterBookHistory } from "~/services/history/hooks/useAutoSaveChapterBookHistory";
import { MiniBanner } from "./components/MiniBanner";
import { VisualizerOptionsSheet, VisualizerOptionsSheetRef } from "./sheets/VisualizerOptionsSheet";

export function ChapterVisualizerScreen(props: StackScreenProps) {
  const params = props.route.params as ChapterVisualizerParams;

  const refVisualizeWebView = useRef<VisualizeWebViewRef>(null);
  const refVisualizerOptionsSheet = useRef<VisualizerOptionsSheetRef>(null);
  const progressRef = useRef<string | number | undefined>(undefined);

  const {availableProgress, init: initAutoSave} = useAutoSaveChapterBookHistory(
    params.id_bookinfo,
    params.chapter,
    params.selected_option,
    async () => {
      const position = await refVisualizeWebView.current?.getCurrentPosition();
      return position;
    },
  );

  const chapter_list = useMemo(() => {
    return params.chapter_list.sort((a, b) => a.chapter_number - b.chapter_number);
  }, [params.chapter_list]);

  const chapter_index = useMemo(() => {
    return chapter_list.findIndex(v => v.id === params.chapter.id);
  }, [chapter_list]);

  const {images, loaded, startLoadImages, cancelLoad} = useLoadChapterImages(
    params.images,
    params.originUrl,
    params.chapter_id,
    async (index, image) => {
      await refVisualizeWebView.current?.loadImage(index, image);
    },
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
    const index = chapter_index + move;
    const chapter = chapter_list.at(index)!;
    const bestOption = chapter.options.sort((a, b) => b.date.getTime() - a.date.getTime())[0];

    goViewChapter({
      index: index,
      option: bestOption,
      chapter: chapter,
      book_url: params.book_url,
      chapters_list: params.chapter_list,
      id_bookinfo: params.id_bookinfo,
      onLoadImages() {
        props.navigation.goBack();
      },
    });
  }, [chapter_index, chapter_list, params.book_url, params.chapter_list, params.id_bookinfo, props.navigation]);

  useEffect(() => {
    setViewedChapter(
      params.id_bookinfo,
      params.chapter_list,
      params.chapter,
      true,
    );

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
          icon={'cog-outline'}
          onPress={() => {
            refVisualizerOptionsSheet.current?.open();
          }}
        />
      </Appbar.Header>
      
      <MiniBanner
        visible={availableProgress !== null}
        message={'¿Reestablecer ultima posición?'}
        actions={[
          {
            label: 'No',
            onPress() {
              initAutoSave();
            },
          },
          {
            label: 'Si',
            loading: !loaded,
            mode: 'contained',
            onPress() {
              refVisualizeWebView.current?.setCurrentPosition(availableProgress as number);
              initAutoSave();
            },
          },
        ]}
      />

      <View className={'flex-1'}>
        <VisualizeWebView
          ref={refVisualizeWebView}
          images={images}
          bookPath={params.chapter_id}
          onLoadEnd={startLoadImages}
        />
      </View>

      <VisualizerOptionsSheet
        ref={refVisualizerOptionsSheet}
        chapter={params.chapter}
        selectedOption={params.selected_option}
        book_url={params.book_url}
        nextChapter={chapter_list[chapter_index + 1]}
        previusChapter={chapter_list[chapter_index - 1]}
        goToChapter={goToChapter}        
      />
    </PrincipalView>
  );
}