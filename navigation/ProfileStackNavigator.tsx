import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "@/screens/ProfileScreen";
import PersonalInformationScreen from "@/screens/PersonalInformationScreen";
import NotificationsScreen from "@/screens/NotificationsScreen";
import PrivacySecurityScreen from "@/screens/PrivacySecurityScreen";
import PaymentMethodsScreen from "@/screens/PaymentMethodsScreen";
import HelpSupportScreen from "@/screens/HelpSupportScreen";
import AboutScreen from "@/screens/AboutScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ProfileStackParamList = {
  Profile: undefined;
  PersonalInformation: undefined;
  Notifications: undefined;
  PrivacySecurity: undefined;
  PaymentMethods: undefined;
  HelpSupport: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformationScreen}
        options={{
          title: "Personal Information",
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="PrivacySecurity"
        component={PrivacySecurityScreen}
        options={{
          title: "Privacy & Security",
        }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{
          title: "Payment Methods",
        }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{
          title: "Help & Support",
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: "About CapsuleCheck",
        }}
      />
    </Stack.Navigator>
  );
}
