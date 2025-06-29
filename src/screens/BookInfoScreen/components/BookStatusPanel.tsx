import React from "react";
import { View } from "react-native";
import { BookStatusItem } from "./BookStatusItem";
import { UserBookStatusList } from "~/api/interfaces/UserBookStatus";
import { UserBookStatus } from "~/api/enums/UserBookStatus";

interface IProps extends UserBookStatusList {
  onToggleStatus(key: keyof UserBookStatusList): void;
}

export function BookStatusPanel(props: IProps) {
  return (
    <View className={'flex-col mx-[-12]'}>
      <View className={'w-full flex-wrap justify-start flex-row'}>
        <BookStatusItem
          icon={'check-circle-outline'}
          iconSelected={'check-circle'}
          color={'#51a351'}
          title={'Leido'}
          value={props.watch}
          onPress={() => {
            props.onToggleStatus(UserBookStatus.WATCH);
          }}
        />

        <BookStatusItem
          icon={'clock-time-five-outline'}
          iconSelected={'clock-time-five'}
          color={'#f89406'}
          title={'Pendiente'}
          value={props.pending}
          onPress={() => {
            props.onToggleStatus(UserBookStatus.PENDING);
          }}
        />

        <BookStatusItem
          icon={'play-circle-outline'}
          iconSelected={'play-circle'}
          color={'#2f96b4'}
          title={'Siguiendo'}
          value={props.follow}
          onPress={() => {
            props.onToggleStatus(UserBookStatus.FOLLOW);
          }}
        />
      </View>

      <View className={'w-full flex-wrap justify-start flex-row'}>
        <BookStatusItem
          icon={'heart-outline'}
          iconSelected={'heart'}
          color={'#bd362f'}
          title={'Favorito'}
          value={props.wish}
          onPress={() => {
            props.onToggleStatus(UserBookStatus.WISH);
          }}
        />

        <BookStatusItem
          icon={'checkbox-outline'}
          iconSelected={'checkbox-marked'}
          color={'#0e67ef'}
          title={'Lo tengo'}
          value={props.have}
          onPress={() => {
            props.onToggleStatus(UserBookStatus.HAVE);
          }}
        />

        <BookStatusItem
          icon={'thumb-down-outline'}
          iconSelected={'thumb-down'}
          color={'#970047'}
          title={'Abandonado'}
          value={props.abandoned}
          onPress={() => {
            props.onToggleStatus(UserBookStatus.ABANDONED);
          }}
        />
      </View>
    </View>
  );
}