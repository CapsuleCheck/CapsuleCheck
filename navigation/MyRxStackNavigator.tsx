import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyRxScreen from "@/screens/MyRxScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type MyRxStackParamList = {
  MyRx: undefined;
};

const Stack = createNativeStackNavigator<MyRxStackParamList>();

export default function MyRxStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="MyRx"
        component={MyRxScreen}
        options={{ headerTitle: "My Prescriptions" }}
      />
    </Stack.Navigator>
  );
}
