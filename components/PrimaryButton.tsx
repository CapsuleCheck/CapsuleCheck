import React from "react";
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: PrimaryButtonProps) {
  const { theme } = useTheme();

  const backgroundColor =
    variant === "primary"
      ? theme.primary
      : variant === "secondary"
      ? theme.secondary
      : "transparent";

  const textColor =
    variant === "outline" ? theme.primary : theme.buttonText;

  const borderColor = variant === "outline" ? theme.primary : "transparent";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled
            ? theme.backgroundTertiary
            : backgroundColor,
          borderColor,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText
          style={[
            styles.text,
            {
              color: disabled ? theme.textSecondary : textColor,
            },
          ]}
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
