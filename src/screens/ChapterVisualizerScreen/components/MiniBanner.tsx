import React, { useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, ButtonProps, Text } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { TimeAnimation } from "~/common/enums/TimeAnimation";
import { useLayoutSize } from "~/common/hooks/useLayoutSize";
import useSafeArea from "~/common/hooks/useSafeArea";
import { ThemeContext } from "~/common/providers/ThemeProvider";

interface IProps {
  visible: boolean;
  loading?: boolean;
  message: string;
  actions: {
    label: string;
    loading?: boolean;
    mode?: ButtonProps['mode'];
    onPress(): void;
  }[];
}
const MIN_HEIGHT_BANNER = 60;

export const MiniBanner = React.memo(function (props: IProps) {
  const {theme} = useContext(ThemeContext);
  const {left, right} = useSafeArea(16);

  const heightValue = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    height: withTiming(
      heightValue.value,
      {duration: TimeAnimation.FAST},
    ),
  }), [props.visible]);

  useEffect(() => {
    heightValue.value = props.visible
      ? MIN_HEIGHT_BANNER
      : 0;
  }, [props.visible]);

  return (
    <Animated.View style={[styles.content, animatedStyles]}>
      <View
        style={{
          height: MIN_HEIGHT_BANNER,
          backgroundColor: theme.colors.elevation.level2,
          paddingLeft: left,
          paddingRight: right,
          paddingVertical: 8,
        }}
        className={'w-full flex-row justify-between gap-[8] items-center'}
      >
        <View className={'flex-row gap-[12] items-center'}>
          {props.loading && <ActivityIndicator size={'small'} />}

          <Text variant={'labelMedium'}>
            {props.message}
          </Text>
        </View>

        {props.actions.length
          ? (<View className={'flex-row aling-center gap-[8] py-[4]'}>
            {props.actions.map((val, index) => (
              <Button
                key={`mini-banner-button-${index}`}
                loading={val.loading}
                disabled={val.loading}
                mode={val.mode}
                compact={true}
                labelStyle={styles.buttonLabel}
                style={[
                  styles.button,
                  val.loading ? {
                    backgroundColor: theme.colors.onSurfaceDisabled,
                  }: undefined,
                ]}
                onPress={val.onPress}
              >
                {val.label}
              </Button>
            ))}
          </View>)
          : <></>
        }
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  content: {
    width: '100%',
    overflow: 'hidden',
  },
  button: {
    borderRadius: 4,
  },
  buttonLabel: {
    margin: 0,
  },
});
