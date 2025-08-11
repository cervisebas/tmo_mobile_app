import React, { useContext, useMemo } from 'react';
import { FlatListProps, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { TimeAnimation } from '../enums/TimeAnimation';
import SafeArea, { SafeAreaCompsProps } from './SafeArea';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';
import Color from 'color';
import { ThemeContext } from '../providers/ThemeProvider';
import { RefreshControl } from './RefreshControl';

type IProps<T> = FlatListProps<T> & SafeAreaCompsProps & {
  loading: boolean;
  heightItems: number;
  useDivider?: boolean;
  useKeyExtractor?: string;
  emptyIcon?: string;
  emptyMessage?: string;
  no_scrollview?: boolean;
};

const _Divider = () => <SafeArea.Divider expandType={'margin'} expandArea={{horizontal: 8}} />;

export default function <T>(props: IProps<T>) {
  const {theme} = useContext(ThemeContext);

  const empty_color = useMemo(
    () => Color(theme.colors.onSurface).alpha(0.6).rgb().string(),
    [theme],
  );

  const preCalcLayout = useMemo(
    () => {
      let offset = 0;

      return (props.data as any[])?.map(val => {
        const height = val?.hide ? 0 : props.heightItems;

        const res = {length: height, offset};
        offset += height;

        return res;
      }) ?? [];
    },
    [
      props.data,
      props.heightItems,
    ],
  );

  function getItemLayout(_data: any, index: number) {
    const calcLayout = preCalcLayout[index];
    //const {length, offset} = preCalcLayout[index];

    return {
      length: calcLayout?.length ?? 0,
      offset: calcLayout?.offset ?? 0,
      index: index,
    };
  }

  function _keyExtractor(item: any, index: number) {
    if (!props.useKeyExtractor) {
      return index.toString();
    }

    if (props.useKeyExtractor.indexOf('{') === -1) {
      return `${props.useKeyExtractor}-${index}`;
    } else {
      const extractor = props.useKeyExtractor;
      const key = extractor.slice(
        extractor.indexOf('{') + 1,
        extractor.lastIndexOf('}'),
      );

      return extractor.replace(`{${key}}`, item[key]);
    }
  }

  if (!props.data?.length) {
    if (props.loading) {
      return (
        <SafeArea.View style={styles.loading_content}>
          <ActivityIndicator size={'large'} />
        </SafeArea.View>
      );
    } else {
      return (
        <SafeArea.ScrollView
          style={{flex: 1}}
          contentContainerStyle={styles.loading_content}
          expandArea={{
            horizontal: 16,
          }}
          refreshControl={
            props.refreshing !== undefined
              ? <RefreshControl
                refreshing={!!props.refreshing}
                onRefresh={props.onRefresh!}
              />
              : undefined
          }
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
                // eslint-disable-next-line react/no-children-prop
                children={props.emptyMessage}
              />
            )}
          </View>
        </SafeArea.ScrollView>
      );
    }
  }

  if (props.no_scrollview) {
    const data = props.data as any[];

    return (
      <React.Fragment>
        {data.map((value, index, array) => (
          <React.Fragment key={_keyExtractor(value, index)}>
            <DynamicItem
              hide={(value.item as any)?.hide}
              height={props.heightItems}
              // eslint-disable-next-line react/no-children-prop
              children={props.renderItem!({item: value} as any) as any}
            />

            {array?.[index + 1] && (
              props.useDivider
                ? <_Divider />
                : props.ItemSeparatorComponent
                  ? <props.ItemSeparatorComponent />
                  : null
            )}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }

  return (
    <SafeArea.FlatList
      {...({
        ...props,
        refreshing: undefined,
        onRefresh: undefined,
      })}
      getItemLayout={getItemLayout}
      keyExtractor={props.useKeyExtractor ? _keyExtractor : props.keyExtractor}
      renderItem={value => (
        <DynamicItem
          key={_keyExtractor(value.item, value.index)}
          hide={(value.item as any)?.hide}
          height={props.heightItems}
          // eslint-disable-next-line react/no-children-prop
          children={props.renderItem!(value) as any}
        />
      )}
      refreshControl={
        props.refreshing !== undefined
          ? <RefreshControl
            refreshing={!!props.refreshing}
            onRefresh={props.onRefresh!}
          />
          : undefined
      }
      ItemSeparatorComponent={
        props.useDivider ? _Divider : props.ItemSeparatorComponent
      }
    />
  );
}

interface DynamicItemProps {
  hide?: boolean;
  height: number;
  children: React.ReactNode;
}

function DynamicItem(props: DynamicItemProps) {
  const animatedStyles = useAnimatedStyle(
    () => ({
      height: withTiming(
        props.hide ? 0 : props.height,
        { duration: TimeAnimation.FAST },
      ),
    }),
    [props.height, props.hide],
  );

  return (
    <Animated.View
      style={[animatedStyles, styles.dynamic_item]}
      // eslint-disable-next-line react/no-children-prop
      children={props.children}
    />
  );
}

const styles = StyleSheet.create({
  dynamic_item: {
    overflow: 'hidden',
  },
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
