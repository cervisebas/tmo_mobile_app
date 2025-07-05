import React, { useContext } from "react";
import { StackNavigator } from "./StackNavigator";
import { ThemeContext } from "~/common/providers/ThemeProvider";
import { Toaster } from 'sonner-native';

export function RootNavigator() {
  const {theme} = useContext(ThemeContext);

  return (
    <React.Fragment>
      <StackNavigator />

      <Toaster
        position={'bottom-center'}
        visibleToasts={1}
        toastOptions={{
          style: {
            backgroundColor: theme.colors.elevation.level3,
          },
          titleStyle: {
            color: theme.colors.onSurface,
          },
          descriptionStyle: {
            color: theme.colors.onSurface,
          },
        }}
      />
    </React.Fragment>
  );
}