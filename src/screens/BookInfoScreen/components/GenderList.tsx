import React from "react";
import { View } from "react-native";
import { Chip, Text } from "react-native-paper";
import { GenderInterface } from "~/api/interfaces/GenderInterface";

interface IProps {
  data: GenderInterface[];
}

export const GenderList = React.memo(function (props: IProps) {
  return (
    <View className={'gap-[8]'}>
      <Text variant={'titleLarge'}>Géneros</Text>
      
      <View className={'flex-wrap gap-[12] w-full justify-start flex-row'}>
        {props.data.map(gender => (
          <Chip
            key={`gender-${gender.path}`}
            mode={'outlined'}
            onPress={() => console.log(gender)}
          >
            {gender.name}
          </Chip>
        ))}
      </View>
    </View>
  );
});
