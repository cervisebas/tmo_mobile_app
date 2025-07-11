import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import useSafeArea from "~/common/hooks/useSafeArea";
import { ThemeContext } from "~/common/providers/ThemeProvider";

interface IProps {
  onSearch?(value: string): void;
}

export interface LibrarySearchBarRef {
  getValue(): string;
}

export const LibrarySearchBar = React.memo(forwardRef(
  function (props: IProps, ref: React.Ref<LibrarySearchBarRef>) {
    const {theme} = useContext(ThemeContext);
    const {left, right} = useSafeArea(12);
    const [value, setValue] = useState('');
    
    useImperativeHandle(ref, () => ({
      getValue() {
        return value;
      },
    }));

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
          onClearIconPress={() => {
            setTimeout(() => {
              props.onSearch?.('');
            }, 200);
          }}
        />
      </View>
    );
  }
));
