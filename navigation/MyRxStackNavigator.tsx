import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyRxScreen from "@/screens/MyRxScreen";
import PrescriptionDetailScreen from "@/screens/PrescriptionDetailScreen";
import RefillRequestScreen from "@/screens/RefillRequestScreen";
import AnalysisResultsScreen from "@/screens/AnalysisResultsScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type MyRxStackParamList = {
  MyRx: undefined;
  PrescriptionDetail: { prescriptionId: string };
  RefillRequest: { prescriptionId: string };
  AnalysisResults: { analysisId: string };
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
      <Stack.Screen
        name="PrescriptionDetail"
        component={PrescriptionDetailScreen}
        options={{ headerTitle: "Prescription Details" }}
      />
      <Stack.Screen
        name="RefillRequest"
        component={RefillRequestScreen}
        options={{ headerTitle: "Request Refill" }}
      />
      <Stack.Screen
        name="AnalysisResults"
        component={AnalysisResultsScreen}
        options={{ headerTitle: "AI Analysis" }}
      />
    </Stack.Navigator>
  );
}
