import { NavigationContainerRef, ParamListBase } from "@react-navigation/native";
import { createRef } from "react";
import { DialogInterface } from "../interfaces/DialogInterface";

export const refNavigation = createRef<NavigationContainerRef<ParamListBase>>();
export const refDialog = createRef<DialogInterface.IRef>();
