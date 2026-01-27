import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PharmaciesScreen from "@/screens/PharmaciesScreen";
import BookAppointmentScreen from "@/screens/BookAppointmentScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { Prescriber } from "@/types/data";

export type PharmaciesStackParamList = {
  Pharmacies: undefined;
  BookAppointment: { prescriberId: string; prescriber: Prescriber };
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
        options={{ headerTitle: "Prescribers" }}
      />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{ headerTitle: "Book Appointment" }}
      />
    </Stack.Navigator>
  );
}
