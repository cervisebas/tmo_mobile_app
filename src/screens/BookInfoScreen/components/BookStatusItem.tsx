import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, TouchableRipple, Icon, Text } from "react-native-paper";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { UserStatus } from "~/api/interfaces/UserBookStatus";

interface IProps {
  icon: string;
  iconSelected: string;
  color: string;
  title: string;
  value: UserStatus;
  onPress?(): void;
}

export function BookStatusItem(props: IProps) {
  const {theme} = useContext(ThemeContext);
  
  return (
    <Surface
      elevation={0}
      style={[
        styles.content,
        {
          backgroundColor: theme.colors.elevation.level1,
        },
      ]}
    >
      <TouchableRipple style={styles.touchable} onPress={props.onPress}>
        <React.Fragment>
          {props.value.user_select ? (
            <Icon
              source={props.iconSelected}
              size={32}
              color={props.color}
            />
          ) : (
            <Icon
              source={props.icon}
              size={32}
              color={props.color}
            />
          )}
          <View className={'gap-[4] flex-col'}>
            <Text variant={'titleMedium'}>
              {props.value.quantity}
            </Text>

            <Text variant={'labelSmall'}>
              {props.title}
            </Text>
          </View>
        </React.Fragment>
      </TouchableRipple>

      <View
        className={'w-full h-[4]'}
        style={{
          backgroundColor: props.color,
          opacity: Number(props.value.user_select),
        }}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  content: {
    overflow: 'hidden',
    width: `${100 / 3}%`,
  },
  touchable: {
    gap: 8,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
