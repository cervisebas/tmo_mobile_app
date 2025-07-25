import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Checkbox, List, Switch } from "react-native-paper";

interface IProps {
  title: string;
  titleNumberOfLines?: number;
  description?: string | React.ReactNode;
  descriptionStyle?: StyleProp<TextStyle>;
  descriptionNumberOfLines?: number;
  fixHeight?: number;
  disabled?: boolean;
  leftIcon?: string;
  leftIconColor?: string;
  style?: StyleProp<ViewStyle>;
  checked?: boolean;
  useSwitch?: boolean;
  onChecked(val: boolean): void;
}

export const ItemWithCheckbox = React.memo(function (props: IProps) {
  return (
    <List.Item
      title={props.title}
      titleNumberOfLines={props.titleNumberOfLines}
      description={props.description}
      descriptionStyle={props.descriptionStyle}
      descriptionNumberOfLines={props.descriptionNumberOfLines}
      left={
        props.leftIcon
          ?
            p => (
              <List.Icon
                {...p}
                icon={props.leftIcon!}
                color={props.leftIconColor ?? p.color}
              />
            )
          : undefined
      }
      right={
        p => (
          props.useSwitch
            ? (
              <Switch
                style={p.style}
                value={props.checked}
                onValueChange={() => props.onChecked(!props.checked)}
              />
            )
            : (
              <Checkbox.Android
                style={p.style}
                status={props.checked ? 'checked' : 'unchecked'}
                onPress={() => props.onChecked(!props.checked)}
              />
            )
        )
      }
      disabled={props.disabled}
      style={[props.style, props.fixHeight ? {height: props.fixHeight} : {}]}
      onPress={() => props.onChecked(!props.checked)}
    />
  );
});
