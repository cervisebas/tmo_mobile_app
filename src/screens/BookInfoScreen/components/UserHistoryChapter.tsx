import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import ItemWithIcon from '~/common/components/ItemWithIcon';
import { useUserChapterBookHistory } from '~/database/hooks/useUserChapterBookHistory';
import { onPressChapterItem } from '../scripts/onPressChapterItem';
import { ThemeContext } from '~/common/providers/ThemeProvider';
import { ChapterInterface } from '~/api/interfaces/ChapterInterface';
import Carousel from 'react-native-reanimated-carousel';
import {
  ItemListChapter,
  useHistoryChapterList,
} from '../hooks/useHistoryChapterList';
import { useSharedValue } from 'react-native-reanimated';
import {
  CarouselRenderItemInfo,
  ICarouselInstance,
} from 'react-native-reanimated-carousel/lib/typescript/types';
import useDimension from '~/common/hooks/useDimension';

interface IProps {
  id_bookinfo: number;
  book_url: string;
  chapters: ChapterInterface[];
}

const ITEM_HEIGHT = 69;

export const UserHistoryChapter = React.memo(function (props: IProps) {
  const { theme } = useContext(ThemeContext);
  const { chapter: currentChapter, option: currentOption } =
    useUserChapterBookHistory(props.id_bookinfo);
  const { itemListChapter } = useHistoryChapterList(
    currentChapter,
    props.chapters,
    currentOption,
  );
  const [WINDOW_WIDTH] = useDimension('window');

  const WIDTH_ELEMENTS = WINDOW_WIDTH - 16;

  const refCarousel = useRef<ICarouselInstance>(null);

  // Animation Values
  const scrollOffsetValue = useSharedValue<number>(0);

  // Actions
  const onPressItem = useCallback(
    (chapter?: ChapterInterface) => {
      if (!chapter) {
        return;
      }

      onPressChapterItem({
        chapter: chapter,
        primaryColor: theme.colors.primary,
        book_url: props.book_url,
        id_bookinfo: props.id_bookinfo,
        chapters: props.chapters,
      });
    },
    [
      currentChapter,
      props.book_url,
      props.chapters,
      props.id_bookinfo,
      theme.colors.primary,
    ],
  );

  // Render Function
  const renderItem = useCallback(
    ({ item: [chapter, option] }: CarouselRenderItemInfo<ItemListChapter>) => (
      <ItemWithIcon
        leftIcon={'play-pause'}
        title={chapter?.title || ''}
        description={option?.title}
        style={{ width: WIDTH_ELEMENTS }}
        onPress={() => onPressItem(chapter)}
        fixHeight={ITEM_HEIGHT}
      />
    ),
    [currentOption],
  );

  useEffect(() => {
    refCarousel.current?.scrollTo({
      count: 0,
      animated: false,
    });
    scrollOffsetValue.value = -0;
  }, [currentChapter]);

  if (!currentChapter || !currentOption) {
    return <></>;
  }

  return (
    <React.Fragment>
      <View className={'flex-col gap-[8]'}>
        <Text variant={'titleLarge'}>Continuar</Text>

        <View className={'w-full'}>
          <Carousel
            ref={refCarousel}
            loop={false}
            snapEnabled={true}
            pagingEnabled={true}
            autoPlayInterval={2000}
            width={WIDTH_ELEMENTS}
            height={ITEM_HEIGHT}
            style={{
              width: WIDTH_ELEMENTS,
              height: ITEM_HEIGHT,
            }}
            data={itemListChapter}
            defaultScrollOffsetValue={scrollOffsetValue}
            onConfigurePanGesture={(gestureChain) =>
              gestureChain.activeOffsetX([-10, 10])
            }
            renderItem={renderItem}
          />
        </View>
      </View>

      <Divider />
    </React.Fragment>
  );
});
