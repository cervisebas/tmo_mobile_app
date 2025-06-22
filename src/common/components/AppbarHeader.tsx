import React, { useContext } from "react";
import { Appbar, AppbarHeaderProps } from "react-native-paper";
import { ThemeContext } from "../providers/ThemeProvider";

export function AppbarHeader(props: AppbarHeaderProps) {
  const {theme} = useContext(ThemeContext);

  return (
    <Appbar.Header
      {...props}
      style={[
        {
          backgroundColor: theme.colors.elevation.level2,
        },
        props.style,
      ]}
    >
      {props.children}
    </Appbar.Header>
  );
}