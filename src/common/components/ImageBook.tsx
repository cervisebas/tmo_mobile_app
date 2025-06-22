import React, {useMemo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Icon, Text, TouchableRipple} from 'react-native-paper';
import { Image } from 'expo-image';
import { BookType } from '~/api/enums/BookType';
import { getColorTypeBook } from '../utils/ColorTypeBook';

interface IProps {
  type?: BookType;
  stars?: number;
  stars_position?: 'top' | 'bottom';
  width: number;
  source: string;
  style?: StyleProp<ViewStyle>;
  onPress?(): void;
}

export const ImageBook = React.memo(function (props: IProps) {
  const size_image = useMemo(
    () => ({
      width: props.width,
      height: props.width * 1.5,
    }),
    [props.width],
  );

  const color_type = useMemo(
    () => props.type && getColorTypeBook(props.type),
    [props.type],
  );

  const type_text = props.type && String(props.type).toUpperCase();

  return (
    <TouchableRipple
      className={'flex-1 relative rounded-[8]'}
      style={[
        styles.content,
        {
          width: size_image.width,
          height: size_image.height,
        },
        props.style,
      ]}
      onPress={props.onPress}
    >
      <React.Fragment>
        <View className={'flex-1'}>
          <Image
            source={{
              uri: props.source,
            }}
            style={styles.image}
            contentFit={'cover'}
          />
        </View>

        {color_type && (
          <View
            className={'absolute top-0 left-0 p-[6] m-[8] rounded-[4]'}
            style={{
              backgroundColor: color_type,
              elevation: 8,
            }}
          >
            <Text
              variant={'labelSmall'}
              className={'z-[2]'}
              style={styles.text_type}
            >
              {type_text}
            </Text>
            <Text
              variant={'labelSmall'}
              numberOfLines={1}
              style={styles.shadow_text_type}
              className={'z-[1] absolute top-0 left-0 absolute m-[7] w-full'}
            >
              {type_text}
            </Text>
          </View>
        )}

        {props.stars ? (
          <View
            className={'right-0 m-[8] absolute rounded-[4] flex-row items-center py-[4] px-[6] bg-black/50 shadow-8'}
            style={{
              [props.stars_position ?? 'bottom']: 0,
            }}
          >
            <>
              <Icon
                source={'star'}
                size={12}
                color={'#ffff00'}
              />
              <Text variant={'labelSmall'}>
                {' ' + (props?.stars?.toFixed?.(2) ?? '')}
              </Text>
            </>
          </View>
        ): null}
      </React.Fragment>
    </TouchableRipple>
  );
});

const styles = StyleSheet.create({
  content: {
    overflow: 'hidden',
  },
  shadow_text_type: {
    color: 'black',
    fontSize: 12,
  },
  image: {
    flex: 1,
  },
  text_type: {
    color: 'white',
    fontSize: 12,
  },
});
