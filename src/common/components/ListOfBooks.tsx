import React, {useCallback, useMemo} from 'react';
import {FlatListProps, ListRenderItemInfo} from 'react-native';
import { BookInfoInterface } from '~/api/interfaces/BookInfoInterface';
import { BookItem } from '~/common/components/BookItem';
import SafeArea from '~/common/components/SafeArea';
import { useLayoutSize } from '~/common/hooks/useLayoutSize';
import { refNavigation } from '~/common/utils/Ref';
import { StackScreens } from '~/enums/StackScreens';

interface IProps {
  data: BookInfoInterface[];
  referer?: string;
  keyExtractor: string;
  ListFooterComponent?: FlatListProps<any>['ListFooterComponent'];
}

const getKey = (s: string, v: string) => s.replace('{id}', v);

export default React.memo(function (props: IProps) {
  const {layout, onLayout} = useLayoutSize();

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
