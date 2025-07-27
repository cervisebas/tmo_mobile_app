import React, { useCallback, useContext, useMemo, useState } from "react";
import { ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import FlatListDynamicItems from "~/common/components/FlatListDynamicItems";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { refNavigation } from "~/common/utils/Ref";
import { useChapterHistory } from "~/database/hooks/useChapterHistory";
import { ChapterHistoryInterface } from "~/database/interfaces/ChapterHistoryInterface";
import { StackScreens } from "~/enums/StackScreens";
import { onPressChapterItem } from "../scripts/onPressChapterItem";

interface IProps {
  book_title: string;
  id_bookinfo: number;
  book_url: string;
  chapters: ChapterInterface[];
}

const MAX_ITEMS_COLAPSE = 6;
const MAX_ITEMS_UNCOLAPSE = 12;
export const CHAPTER_HEIGHT_ITEMS = 52;

export const ChapterList = React.memo(function (props: IProps) {
  const {theme} = useContext(ThemeContext);
  
  const [ascending, setAscending] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const chapters = useChapterHistory(props.chapters);
  
  const data = useMemo(() => {
    const use_data = ascending
      ? chapters.slice().reverse()
      : chapters;

    const items = showAll
      ? use_data.slice(0, MAX_ITEMS_UNCOLAPSE)
      : use_data.slice(0, MAX_ITEMS_COLAPSE);

    return items;
  }, [ascending, chapters, showAll]);
  
  const canShowMore = useMemo(() => (
    !showAll //&&
    //chapters.length > MAX_ITEMS_COLAPSE
  ), [showAll]);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ChapterHistoryInterface>) => (
      <ItemWithIcon
        key={`chapter-item-${item.id}`}
        title={item.title}
        leftIcon={'chevron-down'}
        leftIconColor={theme.colors.primary}
        rightIcon={
          item.viewed
            ? 'eye-outline'
            : 'eye-off-outline'
        }
        rightIconColor={
          item.viewed
            ? theme.colors.inversePrimary
            : theme.colors.onSurfaceDisabled
        }
        fixHeight={CHAPTER_HEIGHT_ITEMS}
        onPress={() => {
          onPressChapterItem({
            chapter: item,
            primaryColor: theme.colors.primary,
            book_url: props.book_url,
            id_bookinfo: props.id_bookinfo,
            chapters: chapters,
          });
        }}
      />
    ),
    [
      chapters,
      props.book_url,
      props.id_bookinfo,
      theme.colors.inversePrimary,
      theme.colors.onSurfaceDisabled,
      theme.colors.primary,
    ],
  );

  return (
    <View className={'flex-col gap-[8]'}>
      <View className={'flex-row justify-between items-center'}>
        <Text variant={'titleLarge'}>
          Capítulos
        </Text>

        <View className={'flex-row'}>
          {!canShowMore && (
            <IconButton
              icon={'format-list-group'}
              mode={'contained'}
              style={styles.button_actions}
              size={20}
              onPress={() => setShowAll(false)}
            />
          )}

          <IconButton
            icon={
              !ascending
                ? 'sort-ascending'
                : 'sort-descending'
            }
            disabled={chapters.length === 1}
            animated={true}
            mode={'contained'}
            style={styles.button_actions}
            size={20}
            onPress={() => setAscending(v => !v)}
          />
        </View>
      </View>

      <FlatListDynamicItems
        data={data}
        renderItem={renderItem}
        loading={false}
        no_scrollview={true}
        heightItems={CHAPTER_HEIGHT_ITEMS}
        useDivider={true}
        useKeyExtractor={'chapter-item-{id}'}
      />

      <View className={'pt-[12] gap-[12]'}>
        {canShowMore && chapters.length > MAX_ITEMS_COLAPSE && <Button
          mode={'contained'}
          className={'w-full'}
          onPress={() => setShowAll(true)}
        >
          VER MÁS (MAX {MAX_ITEMS_UNCOLAPSE} ITEMS)
        </Button>}

        {chapters.length > MAX_ITEMS_COLAPSE && (
          <Button
            mode={'contained'}
            className={'w-full'}
            onPress={() => {
              refNavigation.current?.navigate(
                StackScreens.CHAPTER_LIST,
                {
                  title: props.book_title,
                  chapters: props.chapters,
                  book_url: props.book_url,
                  id_bookinfo: props.id_bookinfo,
                },
              );
            }}
          >
            VER TODO
          </Button>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  button_actions: {
    borderRadius: 6,
  },
});
