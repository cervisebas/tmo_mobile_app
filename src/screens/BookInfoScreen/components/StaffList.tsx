import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List, Text } from 'react-native-paper';
import { BookStaffInterface } from '~/api/interfaces/BookStaffInterface';
import { refNavigation } from '~/common/utils/Ref';
import { StackScreens } from '~/enums/StackScreens';

interface IProps {
  data: BookStaffInterface[];
}

export const StaffList = React.memo(function (props: IProps) {
  if (props.data.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      <Divider />

      <View className={'gap-[8]'}>
        <Text variant={'titleLarge'}>Staff</Text>

        <View className={'w-full flex-col'}>
          {props.data.map((info, index, array) => (
            <React.Fragment key={`staff-item-${info.id}-${info.position}`}>
              <List.Item
                title={info.name}
                description={info.position}
                style={styles.item}
                left={(props) => (
                  <Image
                    {...props}
                    style={[props.style, styles.image]}
                    source={{
                      uri: info.picture,
                    }}
                  />
                )}
                onPress={() => {
                  refNavigation.current?.navigate(
                    StackScreens.AUTHOR_INFO,
                    info,
                  );
                }}
              />

              {array?.[index + 1] && <Divider className={'mx-[12]'} />}
            </React.Fragment>
          ))}
        </View>
      </View>
    </React.Fragment>
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
