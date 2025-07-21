import WebView from 'react-native-webview';
import { LoadingErrorContent } from '~/common/components/LoadingErrorContent';
import { useHtmlVisualizer } from '../hooks/useHtmlVisualizer';
import { ImageItemInterface } from '../interfaces/ImageItemInterface';
import React, { forwardRef, useCallback, useContext, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { DOWNLOAD_IMAGES_FOLDER_PATH } from '../scripts/downloadChapterImages';
import { useVisualizeWebViewSafeArea } from '../hooks/useVisualizeWebViewSafeArea';
import { ThemeContext } from '~/common/providers/ThemeProvider';

interface IProps {
  images: ImageItemInterface[];
  bookPath: string;
  onLoadEnd?(): void;
}

export interface VisualizeWebViewRef {
  loadImage(index: number, val: ImageItemInterface): void;
}


export const VisualizeWebView = forwardRef(function (props: IProps, ref: React.Ref<VisualizeWebViewRef>) {
  const {html, loading} = useHtmlVisualizer();
  const refWebView = useRef<WebView>(null);
  const {theme} = useContext(ThemeContext);

  const {calculeSafeArea} = useVisualizeWebViewSafeArea(
    val => {
      /* refWebView.current?.injectJavaScript(`
        setPaddingTop(${val.top});
        setPaddingLeft(${val.left});
        setPaddingRight(${val.right});
        setPaddingBottom(${val.bottom});
        true;
      `); */
      refWebView.current?.injectJavaScript(`
        setPaddingTop(12);
        setPaddingLeft(${val.left});
        setPaddingRight(${val.right});
        setPaddingBottom(${val.bottom});
        true;
      `);
    },
  );
  
  const _onLoadEnd = useCallback(() => {
    const jsonImages = JSON.stringify(props.images);
    
    refWebView.current?.injectJavaScript(`
      setImages(${jsonImages});
      true;
    `);
    props.onLoadEnd?.();
  }, [props]);



  useImperativeHandle(ref, () => ({
    loadImage(index, image) {
      const jsonVal = JSON.stringify(image);
      refWebView.current?.injectJavaScript(`
        setImage(${index}, ${jsonVal});
        true;
      `);
    },
  }));

  return (
    <LoadingErrorContent loading={loading} error={null}>
      <WebView
        ref={refWebView}
        source={{
          html: html,
          baseUrl: `${DOWNLOAD_IMAGES_FOLDER_PATH}/${props.bookPath}/`,
        }}
        style={[
          styles.webview,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
        androidLayerType={'software'}
        onLoadEnd={() => {
          setTimeout(() => {
            _onLoadEnd();
            calculeSafeArea();
          }, 500);
        }}
        onError={console.error}
        renderLoading={() => (
          <View className={'flex-1 justify-center items-center'}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </LoadingErrorContent>
  );
});

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
