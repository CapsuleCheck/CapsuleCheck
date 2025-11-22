import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface MedicationCardProps {
  name: string;
  supply: string;
  type: string;
  price: string;
  sources: number;
  imageUrl?: string;
  onPress: () => void;
}

export function MedicationCard({
  name,
  supply,
  type,
  price,
  sources,
  imageUrl,
  onPress,
}: MedicationCardProps) {
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
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText style={[styles.detail, { color: theme.textSecondary }]}>
          {supply}, {type}
        </ThemedText>
        <ThemedText style={[styles.sources, { color: theme.success }]}>
          {sources} sources found
        </ThemedText>
      </View>
      <View style={styles.priceContainer}>
        <ThemedText style={styles.price}>{price}</ThemedText>
        <ThemedText style={[styles.priceLabel, { color: theme.textSecondary }]}>
          Starting from
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  detail: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  sources: {
    fontSize: 12,
    fontWeight: "500",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  priceLabel: {
    fontSize: 12,
  },
});
