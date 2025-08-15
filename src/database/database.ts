import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { DatabaseFileName } from "./enums/DatabaseFileName";

const expo = openDatabaseSync(DatabaseFileName.DEFAULT, {enableChangeListener: true});
export const db = drizzle(expo);
