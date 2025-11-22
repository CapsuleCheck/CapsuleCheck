import React from "react";
import { View, StyleSheet } from "react-native";
import { ScreenFlatList } from "@/components/ScreenFlatList";
import { ThemedText } from "@/components/ThemedText";
import { PrescriptionCard } from "@/components/PrescriptionCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

const MOCK_PRESCRIPTIONS = [
  {
    id: "1",
    name: "Atorvastatin 20mg",
    status: "Refill due in 3 days",
    statusType: "warning",
  },
  {
    id: "2",
    name: "Lisinopril 10mg",
    status: "Status: Active",
    statusType: "success",
  },
  {
    id: "3",
    name: "Metformin 500mg",
    status: "Refill due in 10 days",
    statusType: "success",
  },
  {
    id: "4",
    name: "Amlodipine 5mg",
    status: "Status: Active",
    statusType: "success",
  },
];

export default function MyRxScreen() {
  const { theme } = useTheme();

  const getStatusColor = (type: string) => {
    switch (type) {
      case "warning":
        return theme.warning;
      case "success":
        return theme.success;
      case "error":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <ScreenFlatList
      data={MOCK_PRESCRIPTIONS}
      renderItem={({ item }) => (
        <PrescriptionCard
          name={item.name}
          status={item.status}
          statusColor={getStatusColor(item.statusType)}
          onPress={() => {}}
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

