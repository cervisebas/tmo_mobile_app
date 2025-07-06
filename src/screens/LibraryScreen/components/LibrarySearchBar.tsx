import React, { useContext, useState } from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import useSafeArea from "~/common/hooks/useSafeArea";
import { ThemeContext } from "~/common/providers/ThemeProvider";

interface IProps {
  onSearch?(value: string): void;
}

export const LibrarySearchBar = React.memo(
  function (props: IProps) {
    const {theme} = useContext(ThemeContext);
    const {left, right} = useSafeArea(12);
    const [value, setValue] = useState('');
    
    return (
      <View
        className={'pb-[8]'}
        style={{
          paddingLeft: left,
          paddingRight: right,
          backgroundColor: theme.colors.elevation.level2,
        }}
      >
        <Searchbar
          mode={'bar'}
          placeholder={'Buscar...'}
          value={value}
          style={{
            borderRadius: theme.roundness * 4,
            backgroundColor: theme.colors.elevation.level5,
          }}
          onChangeText={setValue}
          returnKeyType={'search'}
          onSubmitEditing={() => props.onSearch?.(value)}
          onClearIconPress={() => props.onSearch?.('')}
        />
      </View>
    );
  }
);
