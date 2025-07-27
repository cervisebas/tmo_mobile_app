import React, { useCallback, useContext } from "react";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { useUserChapterBookHistory } from "~/database/hooks/useUserChapterBookHistory";
import { onPressChapterItem } from "../scripts/onPressChapterItem";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";

interface IProps {
  id_bookinfo: number;
  book_url: string;
  chapters: ChapterInterface[];
}

export const UserHistoryChapter = React.memo(function (props: IProps) {
  const {theme} = useContext(ThemeContext);
  const {chapter, option} = useUserChapterBookHistory(props.id_bookinfo);
  
  const onPressItem = useCallback(() => {
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
  }, [
    chapter,
    props.book_url,
    props.chapters,
    props.id_bookinfo,
    theme.colors.primary
  ]);

  if (!chapter || !option) {
    return <></>;
  }

  return (
    <React.Fragment>
      <View className={'flex-col gap-[8]'}>
        <Text variant={'titleLarge'}>Continuar</Text>

        <ItemWithIcon
          leftIcon={'play-pause'}
          title={chapter.title}
          description={option.title}
          onPress={onPressItem}
        />
      </View>

      <Divider />
    </React.Fragment>
  );
});
