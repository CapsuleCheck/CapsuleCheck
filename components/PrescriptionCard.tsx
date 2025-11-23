import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

const capsuleIcon = require("@/assets/images/capsule-icon.png");

interface PrescriptionCardProps {
  name: string;
  status: string;
  statusColor: string;
  onPress: () => void;
}

export function PrescriptionCard({
  name,
  status,
  statusColor,
  onPress,
}: PrescriptionCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.icon,
            { backgroundColor: theme.primary + "20" },
          ]}
        >
          <Image
            source={capsuleIcon}
            style={{ width: 20, height: 20, tintColor: theme.primary }}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText style={[styles.status, { color: statusColor }]}>
          {status}
        </ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  status: {
    fontSize: 14,
  },
});
