import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PharmaciesScreen from "@/screens/PharmaciesScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type PharmaciesStackParamList = {
  Pharmacies: undefined;
};

const Stack = createNativeStackNavigator<PharmaciesStackParamList>();

export default function PharmaciesStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Pharmacies"
        component={PharmaciesScreen}
        options={{ headerTitle: "Pharmacists" }}
      />
    </Stack.Navigator>
  );
}
