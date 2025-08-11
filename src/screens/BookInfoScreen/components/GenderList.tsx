import { StackActions } from "@react-navigation/native";
import React, { useCallback } from "react";
import { View } from "react-native";
import { Chip, Text } from "react-native-paper";
import { GenderInterface } from "~/api/interfaces/GenderInterface";
import { refNavigation } from "~/common/utils/Ref";
import { StackScreens } from "~/enums/StackScreens";

interface IProps {
  data: GenderInterface[];
}

export const GenderList = React.memo(function (props: IProps) {
  const onPressGender = useCallback((gender: GenderInterface) => {
    refNavigation.current?.dispatch(
      StackActions.push(
        StackScreens.GENDER_LIST,
        {
          gender_title: gender.name,
          gender_value: gender.value,
        },
      ),
    );
  }, []);

  return (
    <View className={'gap-[8]'}>
      <Text variant={'titleLarge'}>Géneros</Text>
      
      <View className={'flex-wrap gap-[12] w-full justify-start flex-row'}>
        {props?.data?.map(gender => (
          <Chip
            key={`gender-${gender.value}`}
            mode={'outlined'}
            onPress={() => onPressGender(gender)}
          >
            {gender.name}
          </Chip>
        ))}
      </View>
    </View>
  );
});
