import { Appbar } from "react-native-paper";
import PrincipalView from "~/common/components/PrincipalView";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import { ChapterVisualizerParams } from "./interfaces/ChapterVisualizerParams";
import { VisualizeWebView, VisualizeWebViewRef } from "./components/VisualizeWebView";
import { useLoadChapterImages } from "./hooks/useLoadChapterImages";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

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
      <Appbar.Header>
        <Appbar.BackAction
          onPress={props.navigation.goBack}
        />
        <Appbar.Content
          title={params.title}
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