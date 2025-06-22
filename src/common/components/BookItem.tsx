import React, {useContext, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import {ThemeContext} from '../providers/ThemeProvider';
import { BookType } from '~/api/enums/BookType';
import { ImageBook } from './ImageBook';

interface IProps {
  path: string;
  width: number;
  title: string;
  picture: string;
  stars: number;
  type: BookType;
  onPress?(): void;
}

const PADDING_VERTICAL = 8;
const PADDING_HORIZONTAL = 10;

export const BookItem = React.memo(function (props: IProps) {
  const {theme} = useContext(ThemeContext);

  const size_image = useMemo(() => {
    return {
      width: props.width - PADDING_HORIZONTAL * 2,
      height: props.width * 1.5 - PADDING_VERTICAL * 2,
    };
  }, [props.width]);

  return (
    <TouchableRipple
      className={'flex-col py-[8] px-[10]'}
      style={{
        width: props.width,
      }}
      onPress={props.onPress}
    >
      <React.Fragment>
        <View
          className={'rounded-[8]'}
          style={[
            styles.image_content,
            {
              width: size_image.width,
              height: size_image.height,
              maxWidth: size_image.width,
              maxHeight: size_image.height,
              backgroundColor: theme.colors.primary,
            },
          ]}
        >
          <ImageBook
            type={props.type}
            width={size_image.width}
            stars={props.stars}
            stars_position={'bottom'}
            source={props.picture}
          />
        </View>

        <View className={'w-full mt-[8] mx-[4]'}>
          <Text variant={'titleSmall'}>
            {props.title}
          </Text>
        </View>
      </React.Fragment>
    </TouchableRipple>
  );
});

const styles = StyleSheet.create({
  image_content: {
    overflow: 'hidden',
  },
});
