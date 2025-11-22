import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientHomeScreen from "@/screens/PatientHomeScreen";
import PrescriberHomeScreen from "@/screens/PrescriberHomeScreen";
import UploadPrescriptionScreen from "@/screens/UploadPrescriptionScreen";
import PriceListScreen from "@/screens/PriceListScreen";
import BookAppointmentScreen from "@/screens/BookAppointmentScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type HomeStackParamList = {
  PatientHome: undefined;
  PrescriberHome: undefined;
  UploadPrescription: undefined;
  PriceList: undefined;
  BookAppointment: { prescriberId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const { theme, isDark } = useTheme();
  const { userRole } = useUser();

  const initialRoute = userRole === "prescriber" ? "PrescriberHome" : "PatientHome";

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="PatientHome"
        component={PatientHomeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="CapsuleCheck" />,
        }}
      />
      <Stack.Screen
        name="PrescriberHome"
        component={PrescriberHomeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="CapsuleCheck" />,
        }}
      />
      <Stack.Screen
        name="UploadPrescription"
        component={UploadPrescriptionScreen}
        options={{ headerTitle: "Upload Prescription" }}
      />
      <Stack.Screen
        name="PriceList"
        component={PriceListScreen}
        options={{ headerTitle: "Price List" }}
      />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{ headerTitle: "Book Appointment" }}
      />
    </Stack.Navigator>
  );
}
