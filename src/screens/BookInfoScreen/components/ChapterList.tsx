import moment from "moment";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { BottomSheetOptionsInterface } from "~/common/components/BottomSheetOptions";
import FlatListDynamicItems from "~/common/components/FlatListDynamicItems";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { refDialog } from "~/common/utils/Ref";

interface IProps {
  chapters: ChapterInterface[];
}

const MAX_ITEMS_COLAPSE = 6;
const HEIGHT_ITEMS = 52;

export const ChapterList = React.memo(function (props: IProps) {
  const {theme} = useContext(ThemeContext);
  
  const [ascending, setAscending] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  const data = useMemo(() => {
    const use_data = ascending
      ? props.chapters.slice().reverse()
      : props.chapters;

    const chapters = showAll
      ? use_data
      : use_data.slice(0, MAX_ITEMS_COLAPSE);

    return chapters;
  }, [ascending, props.chapters, showAll]);
  
  const canShowMore = useMemo(() => (
    !showAll &&
    props.chapters.length > MAX_ITEMS_COLAPSE
  ), [props.chapters.length, showAll]);

  const renderItem = useCallback(({item}: ListRenderItemInfo<ChapterInterface>) => (
    <ItemWithIcon
      title={item.title}
      leftIcon={'chevron-down'}
      leftIconColor={theme.colors.primary}
      rightIcon={'eye-off-outline'}
      fixHeight={HEIGHT_ITEMS}
      onPress={() => {
        const options: BottomSheetOptionsInterface[] = item.options.map(v => ({
          label: v.title,
          description: moment(v.date).format('DD-MM-YYYY'),
          leftIcon: 'play',
          leftIconColor: theme.colors.primary,
          onPress() {
            console.log(v.path);
          },
        }));

        const aditionalOptions: BottomSheetOptionsInterface[] = [];

        refDialog.current?.showBottomSheetOptions(
          'Opciónes del capítulo',
          {
            'Opciónes de lectura': options,
            'Opciónes adicionales': aditionalOptions,
          },
        );
      }}
    />
  ), [theme.colors.primary]);

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
        heightItems={HEIGHT_ITEMS}
        useDivider
        useKeyExtractor={'chapter-item-{data_chapter}'}
      />

      {canShowMore && (
        <View className={'pt-[12]'}>
          <Button
            mode={'contained'}
            className={'w-full'}
            onPress={() => setShowAll(true)}
          >
            VER TODO
          </Button>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  button_actions: {
    borderRadius: 6,
  },
});
