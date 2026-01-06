import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrescriberBookingsScreen from "@/screens/PrescriberBookingsScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { HeaderTitle } from "@/components/HeaderTitle";

export type BookingsStackParamList = {
  BookingsList: undefined;
  BookingDetails: { bookingId: string };
};

const Stack = createNativeStackNavigator<BookingsStackParamList>();

export default function BookingsStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="BookingsList"
        component={PrescriberBookingsScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Bookings" />,
        }}
      />
    </Stack.Navigator>
  );
}
