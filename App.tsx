import ThemeProvider from '~/common/providers/ThemeProvider';
import { RootNavigator } from '~/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import migrations from 'drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '~/database/database';
import { Text } from 'react-native-paper';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import './global.css';

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
        <View className={'bg-black items-center justify-center'}>
          <Text>Migración en progreso...</Text>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <StatusBar animated style={'light'} />

      <RootNavigator />
    </ThemeProvider>
  );
}
