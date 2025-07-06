import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Checkbox, List } from "react-native-paper";

interface IProps {
  title: string;
  description?: string | React.ReactNode;
  fixHeight?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  descriptionNumberOfLines?: number;
  checked?: boolean;
  onChecked(val: boolean): void;
}

export const ItemWithCheckbox = React.memo(function (props: IProps) {
  return (
    <List.Item
      title={props.title}
      description={props.description}
      descriptionStyle={props.descriptionStyle}
      descriptionNumberOfLines={props.descriptionNumberOfLines}
      right={
        p => (
          <Checkbox.Android
            style={p.style}
            status={props.checked ? 'checked' : 'unchecked'}
            onPress={() => props.onChecked(!props.checked)}
          />
        )
      }
      disabled={props.disabled}
      style={[props.style, props.fixHeight ? {height: props.fixHeight} : {}]}
      onPress={() => props.onChecked(!props.checked)}
    />
  );
});
