import React, {createContext, useContext, useMemo} from 'react';
import {
  MD3DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme,
} from '@react-navigation/native';

import PaperDarkTheme from '../../assets/theme-paper-dark.json';
import NavegationDarkTheme from '../../assets/theme-navegation-dark.json';
import { refNavigation } from '../utils/Ref';

export const ThemeContext = createContext({
  theme: MD3DarkTheme,
  navTheme: DarkTheme,
});

const Providers = React.memo(({children}: {children?: React.ReactNode}) => {
  const {theme, navTheme} = useContext(ThemeContext);
  return (
    <PaperProvider
      theme={theme}
    >
      <NavigationContainer
        ref={refNavigation}
        theme={navTheme}
      >
        {children}
      </NavigationContainer>
    </PaperProvider>
  );
});

export default React.memo(function ({children}: {children: React.ReactNode}) {
  const _theme = useMemo(
    () => (
      {
        theme: {...MD3DarkTheme, ...PaperDarkTheme} as never,
        navTheme: {...DarkTheme, ...NavegationDarkTheme} as never,
      }
    ),
    [],
  );

  return (
    <ThemeContext.Provider value={_theme}>
      <Providers>
        {children}
      </Providers>
    </ThemeContext.Provider>
  );
});
