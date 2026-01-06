import React, { useState } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

const MEDICATIONS = [
  {
    id: "1",
    name: "Atorvastatin",
    dosage: "20mg",
    price: 8.50,
    supply: "30-day",
    inStock: true,
  },
  {
    id: "2",
    name: "Lisinopril",
    dosage: "10mg",
    price: 4.99,
    supply: "30-day",
    inStock: true,
  },
  {
    id: "3",
    name: "Metformin",
    dosage: "500mg",
    price: 6.25,
    supply: "60-day",
    inStock: true,
  },
  {
    id: "4",
    name: "Amlodipine",
    dosage: "5mg",
    price: 5.75,
    supply: "30-day",
    inStock: false,
  },
  {
    id: "5",
    name: "Omeprazole",
    dosage: "20mg",
    price: 7.50,
    supply: "30-day",
    inStock: true,
  },
];

export default function PrescriberPricingScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredMedications = MEDICATIONS.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditPrice = (id: string) => {
    setEditingId(id === editingId ? null : id);
  };

  const handleToggleStock = (id: string) => {
    // TODO: Implement stock toggle
    console.log("Toggle stock for:", id);
  };

  return (
    <ScreenScrollView contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}>
      <View style={[styles.header, { paddingTop: screenInsets.paddingTop }]}>
        <ThemedText style={styles.title}>Medication Pricing</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Update prices and stock availability
        </ThemedText>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search medications..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Total Products
          </ThemedText>
          <ThemedText style={styles.summaryValue}>{MEDICATIONS.length}</ThemedText>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            In Stock
          </ThemedText>
          <ThemedText style={[styles.summaryValue, { color: theme.success }]}>
            {MEDICATIONS.filter((m) => m.inStock).length}
          </ThemedText>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Out of Stock
          </ThemedText>
          <ThemedText style={[styles.summaryValue, { color: theme.error }]}>
            {MEDICATIONS.filter((m) => !m.inStock).length}
          </ThemedText>
        </View>
      </View>

      {/* Medications List */}
      <View style={styles.medicationsList}>
        {filteredMedications.map((medication) => (
          <View
            key={medication.id}
            style={[styles.medicationCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={styles.medicationHeader}>
              <View style={styles.medicationInfo}>
                <ThemedText style={styles.medicationName}>{medication.name}</ThemedText>
                <ThemedText style={[styles.medicationDosage, { color: theme.textSecondary }]}>
                  {medication.dosage} - {medication.supply} supply
                </ThemedText>
              </View>
              <Pressable
                style={[
                  styles.stockToggle,
                  { backgroundColor: medication.inStock ? theme.success + "20" : theme.error + "20" },
                ]}
                onPress={() => handleToggleStock(medication.id)}
              >
                <ThemedText
                  style={[styles.stockText, { color: medication.inStock ? theme.success : theme.error }]}
                >
                  {medication.inStock ? "In Stock" : "Out of Stock"}
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.priceRow}>
              <View style={styles.priceDisplay}>
                <ThemedText style={[styles.priceLabel, { color: theme.textSecondary }]}>
                  Current Price
                </ThemedText>
                <ThemedText style={styles.priceValue}>${medication.price.toFixed(2)}</ThemedText>
              </View>

              <Pressable
                style={[styles.editButton, { backgroundColor: theme.primary }]}
                onPress={() => handleEditPrice(medication.id)}
              >
                <Feather name="edit-2" size={16} color={theme.buttonText} />
                <ThemedText style={[styles.editButtonText, { color: theme.buttonText }]}>
                  Update Price
                </ThemedText>
              </Pressable>
            </View>

            {editingId === medication.id && (
              <View style={[styles.editSection, { borderTopColor: theme.border }]}>
                <TextInput
                  style={[styles.priceInput, { backgroundColor: theme.backgroundSecondary, color: theme.text }]}
                  placeholder="Enter new price"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                  defaultValue={medication.price.toFixed(2)}
                />
                <Pressable style={[styles.saveButton, { backgroundColor: theme.success }]}>
                  <ThemedText style={[styles.saveButtonText, { color: "#FFFFFF" }]}>Save</ThemedText>
                </Pressable>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.md,
  },
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
  },
  medicationsList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  medicationCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    marginBottom: Spacing.xxs,
  },
  medicationDosage: {
    fontSize: Typography.sizes.sm,
  },
  stockToggle: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  stockText: {
    fontSize: Typography.sizes.xs,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceDisplay: {},
  priceLabel: {
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing.xxs,
  },
  priceValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  editButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  editSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: Spacing.md,
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    fontSize: Typography.sizes.md,
  },
  saveButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
});
