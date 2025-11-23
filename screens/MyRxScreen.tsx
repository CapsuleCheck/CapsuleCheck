import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenFlatList } from "@/components/ScreenFlatList";
import { ThemedText } from "@/components/ThemedText";
import { PrescriptionCard } from "@/components/PrescriptionCard";
import { useTheme } from "@/hooks/useTheme";
import { usePrescriptions } from "@/hooks/useAppDataHooks";
import { Spacing } from "@/constants/theme";
import { MyRxStackParamList } from "@/navigation/MyRxStackNavigator";
import { Prescription } from "@/types/data";

type NavigationProp = NativeStackNavigationProp<MyRxStackParamList>;

export default function MyRxScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const prescriptions = usePrescriptions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.success;
      case "pending_refill":
        return theme.warning;
      case "refill_requested":
        return theme.primary;
      case "expired":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getStatusText = (prescription: Prescription) => {
    if (prescription.status === "active" && prescription.nextRefillDate) {
      const daysUntilRefill = Math.ceil(
        (new Date(prescription.nextRefillDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysUntilRefill <= 3) {
        return `Refill due in ${daysUntilRefill} ${daysUntilRefill === 1 ? "day" : "days"}`;
      }
      return "Status: Active";
    }
    
    switch (prescription.status) {
      case "pending_refill":
        return "Refill Due Soon";
      case "refill_requested":
        return "Refill Requested";
      case "expired":
        return "Expired";
      default:
        return "Status: Active";
    }
  };

  const handlePrescriptionPress = (prescriptionId: string) => {
    navigation.navigate("PrescriptionDetail", { prescriptionId });
  };

  return (
    <ScreenFlatList
      data={prescriptions.all}
      renderItem={({ item }) => (
        <PrescriptionCard
          name={item.medication.name}
          status={getStatusText(item)}
          statusColor={getStatusColor(item.status)}
          onPress={() => handlePrescriptionPress(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: Spacing.xl }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
            No prescriptions yet. Add your first prescription to get started.
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing["5xl"],
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});

