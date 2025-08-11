import React, { useContext, useMemo } from "react";
import { StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";
import ItemWithIcon from "~/common/components/ItemWithIcon";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { timeAgoShort } from "~/common/utils/TimeAgoShort";

interface IProps {
  title: string;
  chapter: string;
  date: Date;
  onPress?(): void;
  onDelete?(): void;
}

export const UserHistoryItem = React.memo(function (props: IProps) {
  const {theme} = useContext(ThemeContext);

  const timeAgo = useMemo(() => timeAgoShort(props.date), [props.date]);

  return (
    <ItemWithIcon
      title={props.title}
      //description={`Hace ${timeAgo} • ${props.chapter}`}
      description={
        <Text>
          <Text style={styles.timeAgo}>Hace {timeAgo}</Text>  •  {props.chapter}
        </Text>
      }
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
  timeAgo: {
    fontStyle: 'italic',
  },
});
