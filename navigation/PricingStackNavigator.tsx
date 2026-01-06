import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrescriberPricingScreen from "@/screens/PrescriberPricingScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { HeaderTitle } from "@/components/HeaderTitle";

export type PricingStackParamList = {
  PricingList: undefined;
  PricingDetails: { medicationId: string };
};

const Stack = createNativeStackNavigator<PricingStackParamList>();

export default function PricingStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="PricingList"
        component={PrescriberPricingScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Pricing" />,
        }}
      />
    </Stack.Navigator>
  );
}
