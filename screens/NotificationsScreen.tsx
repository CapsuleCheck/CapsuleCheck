import React from "react";
import { View, StyleSheet, Switch, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAppData } from "@/context/AppDataContext";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

type NotificationSetting = {
  id: keyof import("@/types/data").NotificationPreferences;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
};

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { state, updateNotificationPreferences } = useAppData();
  const prefs = state.notificationPreferences;

  const notificationSettings: NotificationSetting[] = [
    {
      id: "refillReminders",
      title: "Refill Reminders",
      description: "Get notified when it's time to refill your prescriptions",
      icon: "bell",
    },
    {
      id: "appointmentReminders",
      title: "Appointment Reminders",
      description: "Reminders for upcoming appointments with prescribers",
      icon: "calendar",
    },
    {
      id: "priceAlerts",
      title: "Price Alerts",
      description: "Get notified when medication prices drop",
      icon: "trending-down",
    },
    {
      id: "promotions",
      title: "Promotional Offers",
      description: "Receive updates about special offers and discounts",
      icon: "tag",
    },
    {
      id: "emailNotifications",
      title: "Email Notifications",
      description: "Receive notifications via email",
      icon: "mail",
    },
    {
      id: "pushNotifications",
      title: "Push Notifications",
      description: "Receive push notifications on your device",
      icon: "smartphone",
    },
  ];

  const toggleNotification = (
    id: keyof import("@/types/data").NotificationPreferences,
  ) => {
    updateNotificationPreferences({
      [id]: !prefs[id],
    });
  };

  return (
    <ScreenScrollView>
      <View style={styles.content}>
        <ThemedText
          style={[styles.description, { color: theme.textSecondary }]}
        >
          Manage how you receive notifications from CapsuleCheck
        </ThemedText>

        <View style={styles.section}>
          {notificationSettings.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.notificationItem,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => toggleNotification(item.id)}
            >
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconBackground,
                    { backgroundColor: theme.primary + "20" },
                  ]}
                >
                  <Feather name={item.icon} size={20} color={theme.primary} />
                </View>
              </View>

              <View style={styles.textContainer}>
                <ThemedText style={styles.title}>{item.title}</ThemedText>
                <ThemedText
                  style={[styles.subtitle, { color: theme.textSecondary }]}
                >
                  {item.description}
                </ThemedText>
              </View>

              <Switch
                value={prefs[item.id]}
                onValueChange={() => toggleNotification(item.id)}
                trackColor={{
                  false: theme.backgroundSecondary,
                  true: theme.primary + "60",
                }}
                thumbColor={
                  prefs[item.id] ? theme.primary : theme.textSecondary
                }
              />
            </Pressable>
          ))}
        </View>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Feather name="info" size={16} color={theme.textSecondary} />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            You can change these settings anytime. Some notifications may be
            required for essential service updates.
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
  description: {
    fontSize: Typography.sizes.md,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
});
