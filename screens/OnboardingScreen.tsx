import React, { useEffect } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { BorderRadius, Spacing } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { ScrollView } from "react-native-gesture-handler";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { completeOnboarding } = useUser();

  useEffect(() => {
    handleCheckAuth();
  }, []);

  const handleCheckAuth = () => {
    const userData = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null;
    if (userData && userData?.token)
      return navigation.navigate("PatientHomeScreen");
  };

  const handlePatientSelect = () => {
    navigation.navigate("PatientOnboarding");
  };

  const handlePharmacistSelect = () => {
    navigation.navigate("PrescriberRegistration");
  };

  const handleSignInSelect = () => {
    navigation.navigate("Login");
  };

  return (
    // <ThemedView
    //   style={[styles.container, { paddingBottom: insets.bottom + Spacing.xl }]}
    // >
    <ScrollView
      style={[
        styles.container,
        { paddingBottom: insets.bottom + Spacing.xl },
        { backgroundColor: theme.backgroundRoot },
      ]}
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xl }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
            resizeMode='contain'
          />
          <ThemedText style={styles.appName}>CapsuleCheck</ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title}>
          Find affordable prescriptions. Simply.
        </ThemedText>

        <View style={styles.optionsContainer}>
          <Pressable
            onPress={handlePatientSelect}
            style={({ pressed }) => [
              styles.optionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Feather name='user' size={32} color={theme.primary} />
            </View>
            <ThemedText style={styles.optionTitle}>Patients</ThemedText>
            <ThemedText
              style={[styles.optionDescription, { color: theme.textSecondary }]}
            >
              Save on medications by finding affordable alternatives at local
              pharmacies.
            </ThemedText>
            <PrimaryButton
              title='Get Started'
              onPress={handlePatientSelect}
              style={styles.optionButton}
            />
          </Pressable>

          <Pressable
            onPress={handlePharmacistSelect}
            style={({ pressed }) => [
              styles.optionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.warning + "20" },
              ]}
            >
              <Feather name='briefcase' size={32} color={theme.warning} />
            </View>
            <ThemedText style={styles.optionTitle}>Prescribers</ThemedText>
            <ThemedText
              style={[styles.optionDescription, { color: theme.textSecondary }]}
            >
              Expand your reach and help patients access affordable care.
            </ThemedText>
            <PrimaryButton
              title='Join the Network'
              onPress={handlePharmacistSelect}
              variant='outline'
              style={styles.optionButton}
            />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <ThemedText
            style={[styles.footerText, { color: theme.textSecondary }]}
          >
            Already have an account?{" "}
            <Pressable onPress={handleSignInSelect}>
              <ThemedText style={[styles.link, { color: theme.primary }]}>
                Sign In
              </ThemedText>
            </Pressable>
          </ThemedText>
        </View>
      </View>
      {/* </ThemedView> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: Spacing.sm,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing["3xl"],
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  optionsContainer: {
    gap: Spacing.lg,
  },
  optionCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  optionButton: {
    width: "100%",
  },
  footer: {
    marginTop: Spacing["3xl"],
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontWeight: "600",
  },
});
