import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

type PaymentMethod = {
  id: string;
  type: "card" | "bank";
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
};

export default function PaymentMethodsScreen() {
  const { theme } = useTheme();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]);

  const getCardIcon = (brand?: string): keyof typeof Feather.glyphMap => {
    switch (brand?.toLowerCase()) {
      case "visa":
      case "mastercard":
      case "amex":
        return "credit-card";
      default:
        return "credit-card";
    }
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
  };

  return (
    <ScreenScrollView>
      <View style={styles.content}>
        <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
          Manage your payment methods for prescription purchases and refills
        </ThemedText>

        <View style={styles.section}>
          {paymentMethods.map((method) => (
            <View
              key={method.id}
              style={[
                styles.paymentCard,
                { backgroundColor: theme.card, borderColor: theme.border },
                method.isDefault && { borderColor: theme.primary, borderWidth: 2 },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <View
                    style={[
                      styles.cardIcon,
                      { backgroundColor: theme.primary + "20" },
                    ]}
                  >
                    <Feather
                      name={getCardIcon(method.brand)}
                      size={24}
                      color={theme.primary}
                    />
                  </View>
                  <View style={styles.cardDetails}>
                    <ThemedText style={styles.cardBrand}>
                      {method.brand} •••• {method.last4}
                    </ThemedText>
                    {method.expiryMonth && method.expiryYear && (
                      <ThemedText style={[styles.cardExpiry, { color: theme.textSecondary }]}>
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </ThemedText>
                    )}
                  </View>
                </View>
                
                {method.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: theme.primary + "20" }]}>
                    <ThemedText style={[styles.defaultText, { color: theme.primary }]}>
                      Default
                    </ThemedText>
                  </View>
                )}
              </View>

              <View style={styles.cardActions}>
                {!method.isDefault && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={() => setDefaultPaymentMethod(method.id)}
                  >
                    <Feather name="check-circle" size={16} color={theme.primary} />
                    <ThemedText style={[styles.actionText, { color: theme.primary }]}>
                      Set as Default
                    </ThemedText>
                  </Pressable>
                )}
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                  onPress={() => removePaymentMethod(method.id)}
                >
                  <Feather name="trash-2" size={16} color={theme.error} />
                  <ThemedText style={[styles.actionText, { color: theme.error }]}>
                    Remove
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <PrimaryButton
          title="Add Payment Method"
          onPress={() => {}}
        />

        <View style={[styles.infoCard, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="shield" size={16} color={theme.textSecondary} />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            Your payment information is encrypted and secure. We never store your full card
            details.
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
  paymentCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  cardDetails: {
    flex: 1,
  },
  cardBrand: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    marginBottom: Spacing.xxs,
  },
  cardExpiry: {
    fontSize: Typography.sizes.sm,
  },
  defaultBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  defaultText: {
    fontSize: Typography.sizes.xs,
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
});
