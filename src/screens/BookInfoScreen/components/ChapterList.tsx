import moment from "moment";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { toast } from "sonner-native";
import { ChapterInterface } from "~/api/interfaces/ChapterInterface";
import { BottomSheetOptionsInterface } from "~/common/components/BottomSheetOptions";
import FlatListDynamicItems from "~/common/components/FlatListDynamicItems";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { refDialog } from "~/common/utils/Ref";
import { useChapterHistory } from "~/database/hooks/useChapterHistory";
import { ChapterHistoryInterface } from "~/database/interfaces/ChapterHistoryInterface";
import { setDatabaseHistoryChapter } from "~/database/services/setDatabaseHistoryChapter";

interface IProps {
  id_bookinfo: number;
  chapters: ChapterInterface[];
}

const MAX_ITEMS_COLAPSE = 6;
const HEIGHT_ITEMS = 52;

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
      ? use_data
      : use_data.slice(0, MAX_ITEMS_COLAPSE);

    return items;
  }, [ascending, chapters, showAll]);
  
  const canShowMore = useMemo(() => (
    !showAll //&&
    //chapters.length > MAX_ITEMS_COLAPSE
  ), [showAll]);

  const onPressChapterItem = useCallback((item: ChapterHistoryInterface) => {
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

    aditionalOptions.push({
      label: item.viewed
        ? 'Marcar como no visto'
        : 'Marcar como visto'
      ,
      leftIcon: item.viewed
        ? 'eye-off-outline'
        : 'eye-outline'
      ,
      onPress() {
        toast.promise(setDatabaseHistoryChapter(props.id_bookinfo, chapters, item, !item.viewed), {
          loading: 'Espere por favor...',
          success(value: boolean) {
            return `Se ha ${value ? 'marcado' : 'desmarcado'} como visto correctamente`;
          },
          error: 'Ocurrio un error inesperado',
        });
      },
    });

    refDialog.current?.showBottomSheetOptions(
      'Opciónes del capítulo',
      {
        'Información': [
          {
            label: 'Nombre',
            leftIcon: 'text',
            description: item.title,
          },
        ],
        'Opciónes de lectura': options,
        'Opciónes adicionales': aditionalOptions,
      },
    );
  }, [
    chapters,
    props.id_bookinfo,
    theme.colors.primary,
  ]);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ChapterHistoryInterface>) => (
      <ItemWithIcon
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
        fixHeight={HEIGHT_ITEMS}
        onPress={() => onPressChapterItem(item)}
      />
    ),
    [
      onPressChapterItem,
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

      {canShowMore && chapters.length > MAX_ITEMS_COLAPSE && (
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
