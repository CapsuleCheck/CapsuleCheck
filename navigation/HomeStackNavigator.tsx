import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientHomeScreen from "@/screens/PatientHomeScreen";
import PharmacistHomeScreen from "@/screens/PharmacistHomeScreen";
import UploadPrescriptionScreen from "@/screens/UploadPrescriptionScreen";
import PriceListScreen from "@/screens/PriceListScreen";
import BookAppointmentScreen from "@/screens/BookAppointmentScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type HomeStackParamList = {
  PatientHome: undefined;
  PharmacistHome: undefined;
  UploadPrescription: undefined;
  PriceList: undefined;
  BookAppointment: { pharmacistId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
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
        name="PharmacistHome"
        component={PharmacistHomeScreen}
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
