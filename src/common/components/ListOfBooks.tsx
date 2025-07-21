import React, {useCallback, useContext, useMemo} from 'react';
import {FlatListProps, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { BookInfoInterface } from '~/api/interfaces/BookInfoInterface';
import { BookItem } from '~/common/components/BookItem';
import SafeArea from '~/common/components/SafeArea';
import { useLayoutSize } from '~/common/hooks/useLayoutSize';
import { refNavigation } from '~/common/utils/Ref';
import { StackScreens } from '~/enums/StackScreens';
import { ThemeContext } from '../providers/ThemeProvider';
import Color from 'color';

interface IProps {
  data: BookInfoInterface[];
  referer?: string;
  keyExtractor: string;
  showEmpty?: boolean;
  emptyIcon?: string;
  emptyMessage?: string;
  ListFooterComponent?: FlatListProps<any>['ListFooterComponent'];
}

const getKey = (s: string, v: string) => s.replace('{id}', v);

export default React.memo(function (props: IProps) {
  const {layout, onLayout} = useLayoutSize();
  const {theme} = useContext(ThemeContext);

  const empty_color = useMemo(
    () => Color(theme.colors.onSurface).alpha(0.6).rgb().string(),
    [theme],
  );

  const WIDTH_ITEM = useMemo(() => {
    return layout.width / 2;
  }, [layout.width]);

  const keyExtractor = useCallback(
    (item: BookInfoInterface) => {
      return getKey(props.keyExtractor, item.path);
    },
    [props.keyExtractor],
  );

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<BookInfoInterface>) => (
      <BookItem
        key={getKey(props.keyExtractor, item.path)}
        path={item.path}
        type={item.type}
        stars={item.stars}
        title={item.title}
        width={WIDTH_ITEM}
        picture={item.picture}
        onPress={() => {
          refNavigation.current?.navigate(
            StackScreens.BOOK_INFO,
            {
              ...item,
              referer: props.referer,
            },
          );
        }}
      />
    ),
    [props.keyExtractor, props.referer, WIDTH_ITEM],
  );

  if (!props.data.length && props.showEmpty) {
    return (
      <SafeArea.View
        style={styles.loading_content}
        expandArea={{
          horizontal: 16,
        }}
      >
        <View style={styles.empty_content}>
          <Icon
            size={60}
            source={props.emptyIcon ?? 'playlist-remove'}
            color={empty_color}
          />

          {props.emptyMessage && (
            <Text
              variant={'titleMedium'}
              style={{
                color: empty_color,
                textAlign: 'center',
              }}
            >
              {props.emptyMessage}
            </Text>
          )}
        </View>
      </SafeArea.View>
    );
  }

  return (
    <SafeArea.FlatList
      onLayout={onLayout}
      data={props.data}
      numColumns={2}
      expandDisableTop
      ListFooterComponent={props.ListFooterComponent}
      expandArea={{
        top: 8,
        bottom: 12,
      }}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
});

const styles = StyleSheet.create({
  loading_content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty_content: {
    gap: 12,
    alignItems: 'center',
    flexDirection: 'column',
  },
});
