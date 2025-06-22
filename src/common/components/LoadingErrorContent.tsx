import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Icon, Text } from "react-native-paper";

interface IProps {
  loading: boolean;
  error: string | null;
  errorIcon?: string;
  children?: React.ReactNode;
}

export const LoadingErrorContent = React.memo(function (props: IProps) {
  if (props.error) {
    return (
      <View className={'flex-1 justify-center items-center flex-col gap-[8]'}>
        <Icon
          source={props.errorIcon ?? 'chat-alert-outline'}
          size={24}
        />

        <Text>{props.error}</Text>
      </View>
    );
  }

  if (props.loading) {
    return (
      <View className={'flex-1 justify-center items-center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return props.children;
});
