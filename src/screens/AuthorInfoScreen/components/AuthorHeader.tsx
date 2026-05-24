import { ScrollHeaderProps } from '@codeherence/react-native-header';
import Color from 'color';
import { Image } from 'expo-image';
import { useContext, useMemo, useCallback } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import { AppbarHeader } from '~/common/components/AppbarHeader';
import useSafeArea from '~/common/hooks/useSafeArea';
import { ThemeContext } from '~/common/providers/ThemeProvider';
import { ShareURL } from '~/common/scripts/ShareURL';
import { refDialog } from '~/common/utils/Ref';
import AuthorWallpaper from '~/assets/author-wallpaper.webp';
import { AuthorImage } from './AuthorImage';

interface IProps extends ScrollHeaderProps {
  link: string;
  title: string;
  picture?: string;
  onBackPress?(): void;
}

const SMALL_HEADER_SIZE = 64;
const LARGE_HEADER_SIZE = 200;

export function AuthorHeader(props: IProps) {
  const { top } = useSafeArea();
  const { theme } = useContext(ThemeContext);

  const smallHeight = useMemo(() => SMALL_HEADER_SIZE + top, [top]);
  const largeHeight = useMemo(
    () => smallHeight + LARGE_HEADER_SIZE,
    [smallHeight],
  );

  const headerColors = useMemo(
    () => ({
      closed: Color(theme.colors.elevation.level2).alpha(0.5).rgb().string(),
      open: Color(theme.colors.elevation.level2).alpha(1).rgb().string(),
    }),
    [theme],
  );

  const contentHeaderAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      props.showNavBar.value,
      [0, 1],
      [headerColors.closed, headerColors.open],
    ),
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      props.showNavBar.value,
      [0, 1],
      [largeHeight, smallHeight],
    ),
  }));

  const goShareLink = useCallback(async () => {
    ShareURL(props.link);
  }, [props.link]);

  return (
    <Animated.View
      className={'relative'}
      style={[contentAnimatedStyle, styles.content]}
    >
      <Animated.View className={'z-[10]'} style={contentHeaderAnimatedStyle}>
        <AppbarHeader mode={'small'} style={styles.header}>
          <Appbar.BackAction onPress={props.onBackPress} />

          <Appbar.Content title={props.title} />

          <Appbar.Action icon={'share-variant-outline'} onPress={goShareLink} />
        </AppbarHeader>
      </Animated.View>

      <Animated.View
        className={'absolute left-0 top-0 z-[9] w-full'}
        style={{ height: largeHeight }}
      >
        <AuthorImage
          source={{
            uri: props.picture,
          }}
          size={120}
          style={styles.picture}
          onPress={() => {
            refDialog.current?.showImage([props.picture!]);
          }}
        />
        <Image
          style={[
            styles.image,
            {
              height: largeHeight,
            },
          ]}
          source={AuthorWallpaper}
          blurRadius={Platform.select({
            ios: 1,
            default: 2,
          })}
          contentFit={'cover'}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    overflow: 'hidden',
  },
  header: {
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    zIndex: 10,
  },
  picture: {
    zIndex: 11,
    left: 0,
    bottom: 0,
    margin: 16,
    position: 'absolute',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
  },
});
