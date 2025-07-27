import { Appbar } from "react-native-paper";
import PrincipalView from "~/common/components/PrincipalView";
import StackScreenProps from "~/common/interfaces/StackScreenProps";
import { ChapterListScreenParams } from "./interfaces/ChapterListScreenParams";
import { AppbarHeader } from "~/common/components/AppbarHeader";
import { ChapterListSearchBar } from "./components/ChapterListSearchBar";
import useSearchArray from "~/common/hooks/useSearchArray";
import FlatListDynamicItems from "~/common/components/FlatListDynamicItems";
import { useCallback, useContext, useMemo, useState } from "react";
import { ListRenderItemInfo } from "react-native";
import { ChapterHistoryInterface } from "~/database/interfaces/ChapterHistoryInterface";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { CHAPTER_HEIGHT_ITEMS } from "../BookInfoScreen/components/ChapterList";
import { useChapterHistory } from "~/database/hooks/useChapterHistory";
import { onPressChapterItem } from "../BookInfoScreen/scripts/onPressChapterItem";

export function ChapterListScreen(props: StackScreenProps) {
  const params = props.route.params as ChapterListScreenParams;
  const {theme} = useContext(ThemeContext);
  const chapters = useChapterHistory(params.chapters);

  const [ascending, setAscending] = useState(false);
  const data = useMemo(() => {
    const use_data = ascending
      ? chapters.slice().reverse()
      : chapters;

    return use_data;
  }, [ascending, chapters]);

  const {resultData, setSearch} = useSearchArray(data, ['title', 'chapter_number']);
  
  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ChapterHistoryInterface>) => (
      <ItemWithIcon
        key={`chapter-list-item-${item.id}`}
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
            book_url: params.book_url,
            id_bookinfo: params.id_bookinfo,
            chapters: chapters,
          });
        }}
      />
    ),
    [
      chapters,
      params.book_url,
      params.id_bookinfo,
      theme.colors.inversePrimary,
      theme.colors.onSurfaceDisabled,
      theme.colors.primary,
    ],
  );

  return (
    <PrincipalView>
      <AppbarHeader>
        <Appbar.BackAction
          onPress={props.navigation.goBack}
        />

        <Appbar.Content
          title={params.title}
        />

        <Appbar.Action
          icon={
            !ascending
              ? 'sort-ascending'
              : 'sort-descending'
          }
          onPress={() => setAscending(v => !v)}
        />
      </AppbarHeader>

      <ChapterListSearchBar
        onSearch={setSearch}
      />

      <FlatListDynamicItems
        data={resultData}
        renderItem={renderItem}
        loading={false}
        expandDisableTop={true}
        expandArea={{
          bottom: 24,
        }}
        useDivider={true}
        useKeyExtractor={'chapter-list-item-{id}'}
        heightItems={CHAPTER_HEIGHT_ITEMS}
      />
    </PrincipalView>
  );
}
