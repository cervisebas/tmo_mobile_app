import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { Tooltip, Appbar, Badge } from "react-native-paper";

interface IProps {
  onPress?(): void;
}

export interface AppbarActionFilterRef {
  setQuantityFilter(val: number): void;
}

export const AppbarActionFilter = forwardRef(function (props: IProps, ref: React.Ref<AppbarActionFilterRef>) {
  const [quantity, setQuantity] = useState(0);

  useImperativeHandle(ref, () => ({
    setQuantityFilter: setQuantity,
  }));

  return (
    <View className={'relative'}>
      <Tooltip title={'Filtros'}>
        <Appbar.Action
          icon={'filter-variant'}
          onPress={props.onPress}
        />
      </Tooltip>
      <Badge
        className={'absolute top-[4] right-[4]'}
        pointerEvents={'none'}
        visible={quantity > 0}
      >
        {quantity}
      </Badge>
    </View>
  );
});
