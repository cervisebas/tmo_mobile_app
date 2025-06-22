import { Drawer } from 'react-native-paper';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface IProps {
  icon: string;
  title: string;
  active: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?(): void;
}

export function DrawerItem(props: IProps) {
  return (
    <Drawer.Item
      icon={props.icon}
      label={props.title}
      active={props.active}
      style={[
        props.style,
        styles.content,
      ]}
      onPress={props.onPress}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    borderRadius: 8,
  },
});
