import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { CapsuleIcon } from "@/components/CapsuleIcon";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

export default function AboutScreen() {
  const { theme } = useTheme();

  const appInfo = [
    { label: "Version", value: "1.0.0" },
    { label: "Build", value: "2024.11.23" },
    { label: "Platform", value: "iOS & Android" },
  ];

  const legalLinks = [
    { icon: "file-text" as keyof typeof Feather.glyphMap, title: "Terms of Service" },
    { icon: "shield" as keyof typeof Feather.glyphMap, title: "Privacy Policy" },
    { icon: "award" as keyof typeof Feather.glyphMap, title: "Licenses" },
  ];

  const teamLinks = [
    { icon: "globe" as keyof typeof Feather.glyphMap, title: "Visit Our Website", url: "capsulecheck.com" },
    { icon: "twitter" as keyof typeof Feather.glyphMap, title: "Follow on Twitter", url: "@CapsuleCheck" },
    { icon: "instagram" as keyof typeof Feather.glyphMap, title: "Follow on Instagram", url: "@CapsuleCheck" },
  ];

  return (
    <ScreenScrollView>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.primary + "20" }]}>
            <CapsuleIcon size={48} color={theme.primary} />
          </View>
          <ThemedText style={styles.appName}>CapsuleCheck</ThemedText>
          <ThemedText style={[styles.tagline, { color: theme.textSecondary }]}>
            Your Prescription, Simplified
          </ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>About CapsuleCheck</ThemedText>
          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            CapsuleCheck is a prescription-as-a-service platform that connects patients with
            affordable medications and independent prescribers. Our AI-powered analysis helps
            you save money, understand your medications better, and make informed healthcare
            decisions.
          </ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>App Information</ThemedText>
          {appInfo.map((item, index) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                { borderBottomColor: theme.border },
                index === appInfo.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>
                {item.label}
              </ThemedText>
              <ThemedText style={styles.infoValue}>{item.value}</ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>Legal</ThemedText>
          {legalLinks.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.linkItem,
                { borderBottomColor: theme.border },
                index === legalLinks.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => {}}
            >
              <Feather name={item.icon} size={20} color={theme.text} />
              <ThemedText style={styles.linkText}>{item.title}</ThemedText>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </Pressable>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>Connect With Us</ThemedText>
          {teamLinks.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.linkItem,
                { borderBottomColor: theme.border },
                index === teamLinks.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => {}}
            >
              <Feather name={item.icon} size={20} color={theme.text} />
              <View style={styles.linkContent}>
                <ThemedText style={styles.linkTitle}>{item.title}</ThemedText>
                <ThemedText style={[styles.linkSubtitle, { color: theme.textSecondary }]}>
                  {item.url}
                </ThemedText>
              </View>
              <Feather name="external-link" size={16} color={theme.textSecondary} />
            </Pressable>
          ))}
        </View>

        <ThemedText style={[styles.copyright, { color: theme.textSecondary }]}>
          © 2024 CapsuleCheck. All rights reserved.
        </ThemedText>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
  },
  header: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: Typography.sizes.xxl,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: Typography.sizes.md,
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
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.sizes.md,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: Typography.sizes.md,
  },
  infoValue: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  linkText: {
    flex: 1,
    fontSize: Typography.sizes.md,
    fontWeight: "500",
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "500",
    marginBottom: Spacing.xxs,
  },
  linkSubtitle: {
    fontSize: Typography.sizes.sm,
  },
  copyright: {
    fontSize: Typography.sizes.sm,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
