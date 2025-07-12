import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Divider, List, Text } from "react-native-paper";
import { BookStaffInterface } from "~/api/interfaces/BookStaffInterface";

interface IProps {
  data: BookStaffInterface[];
}

export const StaffList = React.memo(function (props: IProps) {
  if (props.data.length === 0) {
    return null;
  }

  return (
    <View className={'gap-[8]'}>
      <Text variant={'titleLarge'}>Staff</Text>

      <View className={'w-full flex-col'}>
        {props.data.map((val, index, array) => (
          <React.Fragment key={`staff-item-${val.id}-${val.position}`}>
            <List.Item
              title={val.name}
              description={val.position}
              style={styles.item}
              left={props => (
                <Image
                  {...props}
                  style={[
                    props.style,
                    styles.image,
                  ]}
                  source={{
                    uri: val.picture,
                  }}
                />
              )}
            />

            {array?.[index + 1] && (
              <Divider className={'mx-[12]'} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  item: {
    //height: 64,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
