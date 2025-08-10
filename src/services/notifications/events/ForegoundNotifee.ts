import { Event } from "@notifee/react-native";
import { Subject } from "rxjs";

export const ForegroundNotifee = new Subject<Event>();
