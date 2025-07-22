import React, { useContext } from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import useSafeArea from "~/common/hooks/useSafeArea";
import useSearchEvent from "~/common/hooks/useSearchEvent";
import { ThemeContext } from "~/common/providers/ThemeProvider";

interface IProps {
  onSearch?(value: string): void;
}

export const ChapterListSearchBar = React.memo(function (props: IProps) {
  const {theme} = useContext(ThemeContext);
  const {left, right} = useSafeArea(12);
  const {valueSearch, setValueSearch} = useSearchEvent(props.onSearch);
  

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
        placeholder={'Buscar capítulo...'}
        value={valueSearch}
        style={{
          borderRadius: theme.roundness * 4,
          backgroundColor: theme.colors.elevation.level5,
        }}
        onChangeText={setValueSearch}
        returnKeyType={'search'}
        autoCapitalize={'none'}
        onSubmitEditing={() => props.onSearch?.(valueSearch)}
        onClearIconPress={() => {
          setTimeout(() => {
            props.onSearch?.('');
          }, 200);
        }}
      />
    </View>
  );
});
