import React from "react";
import { View } from "react-native";
import { BookStatusItem } from "./BookStatusItem";
import { UserBookStatus } from "~/api/interfaces/UserBookStatus";

export function BookStatusPanel({watch, pending, follow, wish, have, abandoned}: UserBookStatus) {
  return (
    <View className={'flex-col mx-[-12]'}>
      <View className={'w-full flex-wrap justify-start flex-row'}>
        <BookStatusItem
          icon={'check-circle-outline'}
          iconSelected={'check-circle'}
          color={'#51a351'}
          title={'Leido'}
          value={watch}
        />

        <BookStatusItem
          icon={'clock-time-five-outline'}
          iconSelected={'clock-time-five'}
          color={'#f89406'}
          title={'Pendiente'}
          value={pending}
        />

        <BookStatusItem
          icon={'play-circle-outline'}
          iconSelected={'play-circle'}
          color={'#2f96b4'}
          title={'Siguiendo'}
          value={follow}
        />
      </View>

      <View className={'w-full flex-wrap justify-start flex-row'}>
        <BookStatusItem
          icon={'heart-outline'}
          iconSelected={'heart'}
          color={'#bd362f'}
          title={'Favorito'}
          value={wish}
        />

        <BookStatusItem
          icon={'checkbox-outline'}
          iconSelected={'checkbox'}
          color={'#0e67ef'}
          title={'Lo tengo'}
          value={have}
        />

        <BookStatusItem
          icon={'thumb-down-outline'}
          iconSelected={'thumb-down'}
          color={'#970047'}
          title={'Abandonado'}
          value={abandoned}
        />
      </View>
    </View>
  );
}