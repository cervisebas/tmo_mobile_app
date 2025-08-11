import { RefreshControlProps, RefreshControl as NativeRefreshControl } from "react-native";
import { ThemeContext } from "../providers/ThemeProvider";
import { useContext } from "react";

export function RefreshControl(props: RefreshControlProps) {
  const { theme } = useContext(ThemeContext);
  
  return(<NativeRefreshControl
    {...props}
    enabled={props.enabled}
    refreshing={props.refreshing}
    colors={[theme.colors.onSurface]}
    progressBackgroundColor={theme.colors.elevation.level2}
    onRefresh={props.onRefresh}
  />);
}
