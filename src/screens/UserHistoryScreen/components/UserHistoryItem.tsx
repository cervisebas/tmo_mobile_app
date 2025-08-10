import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { ThemeContext } from "~/common/providers/ThemeProvider";

interface IProps {
  title: string;
  chapter: string;
  onPress?(): void;
  onDelete?(): void;
}

export const UserHistoryItem = React.memo(function (props: IProps) {
  const {theme} = useContext(ThemeContext);

  return (
    <ItemWithIcon
      title={props.title}
      description={props.chapter}
      descriptionNumberOfLines={2}
      leftIcon={'play'}
      leftIconColor={theme.colors.primary}
      fixHeight={72}
      right={rp => (
        <IconButton
          iconColor={rp.color}
          style={[rp.style, styles.icon]}
          contentStyle={styles.icon}
          icon={'delete-outline'}
          onPress={props.onDelete}
        />
      )}
      onPress={props.onPress}
    />
  );
});

const styles = StyleSheet.create({
  icon: {
    margin: 0,
  },
});
