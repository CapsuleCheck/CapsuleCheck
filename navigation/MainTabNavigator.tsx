import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import HomeStackNavigator from "@/navigation/HomeStackNavigator";
import MyRxStackNavigator from "@/navigation/MyRxStackNavigator";
import PharmaciesStackNavigator from "@/navigation/PharmaciesStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import BookingsStackNavigator from "@/navigation/BookingsStackNavigator";
import PricingStackNavigator from "@/navigation/PricingStackNavigator";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { useAppData } from "@/context/AppDataContext";
import { usePrescriberProfile } from "@/hooks/useAppDataHooks";
import { CapsuleIcon } from "@/components/CapsuleIcon";
import { PrescriberLicenseUploadModal } from "@/components/PrescriberLicenseUploadModal";

export type MainTabParamList = {
  HomeTab: undefined;
  MyRxTab: undefined;
  PharmaciesTab: undefined;
  ProfileTab: undefined;
  BookingsTab: undefined;
  PricingTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const { userRole, token } = useUser();
  const prescriberProfile = usePrescriberProfile();
  const { updatePrescriberProfile } = useAppData();

  const isPrescriber = userRole === "prescriber";
  const hasLicense = Boolean(
    prescriberProfile?.licenseFileUrl &&
      prescriberProfile.licenseFileUrl.trim(),
  );
  const showLicenseModal = isPrescriber && !hasLicense;

  return (
    <>
      <PrescriberLicenseUploadModal
        visible={showLicenseModal}
        token={token}
        onUploadSuccess={() =>
          updatePrescriberProfile({ licenseFileUrl: "uploaded" })
        }
      />
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={{
          tabBarActiveTintColor: theme.tabIconSelected,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: Platform.select({
              ios: "transparent",
              android: theme.backgroundRoot,
            }),
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView
                intensity={100}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            ) : null,
          headerShown: false,
        }}
      >
        {isPrescriber ? (
          <>
            <Tab.Screen
              name="HomeTab"
              component={HomeStackNavigator}
              options={{
                title: "Dashboard",
                tabBarIcon: ({ color, size }) => (
                  <Feather name="grid" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="BookingsTab"
              component={BookingsStackNavigator}
              options={{
                title: "Bookings",
                tabBarIcon: ({ color, size }) => (
                  <Feather name="calendar" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="PricingTab"
              component={PricingStackNavigator}
              options={{
                title: "Database",
                tabBarIcon: ({ color, size }) => (
                  <Feather name="dollar-sign" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="ProfileTab"
              component={ProfileStackNavigator}
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <Feather name="user" size={size} color={color} />
                ),
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name="HomeTab"
              component={HomeStackNavigator}
              options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                  <Feather name="home" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="MyRxTab"
              component={MyRxStackNavigator}
              options={{
                title: "My Rx",
                tabBarIcon: ({ color, size }) => (
                  <CapsuleIcon size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="PharmaciesTab"
              component={PharmaciesStackNavigator}
              options={{
                title: "Prescribers",
                tabBarIcon: ({ color, size }) => (
                  <Feather name="map-pin" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="ProfileTab"
              component={ProfileStackNavigator}
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <Feather name="user" size={size} color={color} />
                ),
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </>
  );
}
