import React, { useState } from "react";
import { View, StyleSheet, Switch, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

export default function PrivacySecurityScreen() {
  const { theme } = useTheme();

  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const securityOptions = [
    {
      id: "biometric",
      title: "Biometric Authentication",
      description: "Use Face ID or fingerprint to unlock the app",
      icon: "shield" as keyof typeof Feather.glyphMap,
      enabled: biometricEnabled,
      onToggle: setBiometricEnabled,
    },
    {
      id: "2fa",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      icon: "lock" as keyof typeof Feather.glyphMap,
      enabled: twoFactorEnabled,
      onToggle: setTwoFactorEnabled,
    },
    {
      id: "sharing",
      title: "Share Usage Data",
      description: "Help improve CapsuleCheck by sharing anonymous usage data",
      icon: "activity" as keyof typeof Feather.glyphMap,
      enabled: dataSharing,
      onToggle: setDataSharing,
    },
  ];

  return (
    <ScreenScrollView>
      <View style={styles.content}>
        <View
          style={[
            styles.section,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>
            Password & Authentication
          </ThemedText>

          <Pressable
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => {}}
          >
            <Feather name="key" size={20} color={theme.text} />
            <View style={styles.menuTextContainer}>
              <ThemedText style={styles.menuTitle}>Change Password</ThemedText>
              <ThemedText
                style={[styles.menuSubtitle, { color: theme.textSecondary }]}
              >
                Update your account password (Requires backend authentication)
              </ThemedText>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>

          {securityOptions.map((option, index) => (
            <View
              key={option.id}
              style={[
                styles.menuItem,
                index < securityOptions.length - 1 && {
                  borderBottomColor: theme.border,
                },
              ]}
            >
              <Feather name={option.icon} size={20} color={theme.text} />
              <View style={styles.menuTextContainer}>
                <ThemedText style={styles.menuTitle}>{option.title}</ThemedText>
                <ThemedText
                  style={[styles.menuSubtitle, { color: theme.textSecondary }]}
                >
                  {option.description}
                </ThemedText>
              </View>
              <Switch
                value={option.enabled}
                onValueChange={option.onToggle}
                trackColor={{
                  false: theme.backgroundSecondary,
                  true: theme.primary + "60",
                }}
                thumbColor={
                  option.enabled ? theme.primary : theme.textSecondary
                }
              />
            </View>
          ))}
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>Privacy Controls</ThemedText>

          <Pressable
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => {}}
          >
            <Feather name="eye-off" size={20} color={theme.text} />
            <View style={styles.menuTextContainer}>
              <ThemedText style={styles.menuTitle}>Privacy Settings</ThemedText>
              <ThemedText
                style={[styles.menuSubtitle, { color: theme.textSecondary }]}
              >
                Control who can see your information (Requires backend)
              </ThemedText>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => {}}>
            <Feather name="download" size={20} color={theme.text} />
            <View style={styles.menuTextContainer}>
              <ThemedText style={styles.menuTitle}>Download My Data</ThemedText>
              <ThemedText
                style={[styles.menuSubtitle, { color: theme.textSecondary }]}
              >
                Request a copy of your personal data (Requires backend)
              </ThemedText>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>
            Account Management
          </ThemedText>

          <PrimaryButton
            title="Delete Account"
            onPress={() => {}}
            variant="outline"
            style={styles.dangerButton}
          />
          <ThemedText style={[styles.dangerText, { color: theme.error }]}>
            This action is permanent and cannot be undone. All your data will be
            deleted.
          </ThemedText>
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
  },
  section: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    marginBottom: Spacing.xxs,
  },
  menuSubtitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  dangerButton: {
    marginBottom: Spacing.md,
  },
  dangerText: {
    fontSize: Typography.sizes.sm,
    textAlign: "center",
    lineHeight: 20,
  },
});
