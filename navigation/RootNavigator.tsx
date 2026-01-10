import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "@/screens/OnboardingScreen";
import PatientOnboardingScreen from "@/screens/PatientOnboardingScreen";
import PatientPasswordScreen from "@/screens/PatientPasswordScreen";
import LoginScreen from "@/screens/LoginScreen";
import LicenseVerificationScreen from "@/screens/LicenseVerificationScreen";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import { useUser } from "@/context/UserContext";
import PatientHomeScreen from "@/screens/PatientHomeScreen";

export type RootStackParamList = {
  Onboarding: undefined;
  PatientOnboarding: undefined;
  PatientPassword: { formData: unknown };
  Login: undefined;
  LicenseVerification: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { hasCompletedOnboarding } = useUser();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <>
          <Stack.Screen name='Onboarding' component={OnboardingScreen} />
          <Stack.Screen
            name='PatientOnboarding'
            component={PatientOnboardingScreen}
          />
          <Stack.Screen
            name='PatientPassword'
            component={PatientPasswordScreen}
          />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen
            name='LicenseVerification'
            component={LicenseVerificationScreen}
          />
          {/* <Stack.Screen
            name='PatientHomeScreen'
            component={PatientHomeScreen}
          /> */}
        </>
      ) : (
        <Stack.Screen name='Main' component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
