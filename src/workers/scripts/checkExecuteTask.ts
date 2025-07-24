import * as Network from 'expo-network';
import * as Battery from 'expo-battery';
import { Notifications } from '~/notifications';

export async function checkExecuteTask() {
  // Check Notifications
  if (!(await Notifications.isAvailable())) {
    throw '[BackgroundTask] Notificaciones no disponibles: abortando.';
  }

  // Check Network
  const {isInternetReachable} = await Network.getNetworkStateAsync();

  if (!isInternetReachable) {
    throw '[BackgroundTask] Internet no disponible.: abortando';
  }

  // Battery check
  const batteryState = await Battery.getPowerStateAsync();
  const battertLevel = batteryState.batteryLevel ?? 0;
  const batteryCharging = batteryState.batteryState === Battery.BatteryState.CHARGING;

  if (!batteryCharging && battertLevel < 0.2) {
    throw `[BackgroundTask] Batería baja (${battertLevel * 100}%): abortando.`;
  }
}
