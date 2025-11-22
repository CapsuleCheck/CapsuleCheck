import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface PrescriberCardProps {
  name: string;
  rating: number;
  reviews: number;
  time: string;
  type: string;
  imageUrl?: string;
  onPress: () => void;
}

export function PrescriberCard({
  name,
  rating,
  reviews,
  time,
  type,
  onPress,
}: PrescriberCardProps) {
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
      <View style={styles.content}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <View style={styles.row}>
          <Feather name="star" size={14} color="#F59E0B" />
          <ThemedText style={styles.rating}>
            {rating} ({reviews} reviews)
          </ThemedText>
        </View>
        <ThemedText style={[styles.detail, { color: theme.textSecondary }]}>
          {time} • {type}
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
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  rating: {
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
  detail: {
    fontSize: 14,
  },
});
