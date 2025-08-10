import { Event } from "@notifee/react-native";
import { Subject } from "rxjs";

export const BackgroundNotifee = new Subject<Event>();
