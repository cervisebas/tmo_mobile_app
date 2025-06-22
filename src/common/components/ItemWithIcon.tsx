import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {List} from 'react-native-paper';

interface IProps {
  title: string;
  description?: string | React.ReactNode;
  leftIcon?: string;
  rightIcon?: string;
  fixHeight?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  descriptionNumberOfLines?: number;
  onPress?: () => void;
}
export default React.memo(function (props: IProps) {
  return (
    <List.Item
      title={props.title}
      description={props.description}
      descriptionStyle={props.descriptionStyle}
      descriptionNumberOfLines={props.descriptionNumberOfLines}
      left={
        props.leftIcon
          ? // eslint-disable-next-line react/no-unstable-nested-components
            p => <List.Icon {...p} icon={props.leftIcon!} />
          : undefined
      }
      right={
        props.rightIcon
          ? // eslint-disable-next-line react/no-unstable-nested-components
            p => <List.Icon {...p} icon={props.rightIcon!} />
          : undefined
      }
      disabled={props.disabled}
      style={[props.style, props.fixHeight ? {height: props.fixHeight} : {}]}
      onPress={props.onPress}
    />
  );
});
