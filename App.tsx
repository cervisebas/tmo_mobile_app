import ThemeProvider from '~/common/providers/ThemeProvider';
import { RootNavigator } from '~/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import migrations from 'drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '~/database/database';
import { Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Dialogs } from '~/common/components/Dialogs';
import { refDialog } from '~/common/utils/Ref';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SystemBars } from "react-native-edge-to-edge";
import { Notifications } from "~/services/notifications";
import './global.css';

Notifications.registEvents();
export default function App() {
  const { success, error } = useMigrations(db, migrations);
  
  if (error) {
    return (
      <ThemeProvider>
        <View className={'bg-black flex-1 items-center justify-center'}>
          <Text>Error de migración: {error.message}</Text>
        </View>
      </ThemeProvider>
    );
  }

  if (!success) {
    return (
      <ThemeProvider>
        <View className={'bg-black flex-1 items-center justify-center'}>
          <Text>Migración en progreso...</Text>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={styles.content}>
        <BottomSheetModalProvider>
          <SystemBars style={{navigationBar: 'auto'}} />
          <StatusBar animated style={'light'} />

          <RootNavigator />
          <Dialogs ref={refDialog} />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
