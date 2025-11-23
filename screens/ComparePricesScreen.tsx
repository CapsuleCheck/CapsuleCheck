import React, { useState, useMemo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useMedicationPrices } from "@/hooks/useAppDataHooks";
import { MyRxStackParamList } from "@/navigation/MyRxStackNavigator";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { PriceSource } from "@/types/data";

type ComparePricesScreenRouteProp = RouteProp<MyRxStackParamList, "ComparePrices">;
type ComparePricesScreenNavigationProp = NativeStackNavigationProp<
  MyRxStackParamList,
  "ComparePrices"
>;

type SortOption = "price" | "distance" | "name";

export default function ComparePricesScreen() {
  const route = useRoute<ComparePricesScreenRouteProp>();
  const navigation = useNavigation<ComparePricesScreenNavigationProp>();
  const { theme } = useTheme();
  const { medicationId } = route.params;
  const medicationPrices = useMedicationPrices();
  
  const [sortBy, setSortBy] = useState<SortOption>("price");
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);

  const priceData = medicationPrices.getByMedicationId(medicationId);

  const sortedSources = useMemo(() => {
    if (!priceData) return [];
    
    const sources = [...priceData.sources];
    
    switch (sortBy) {
      case "price":
        return sources.sort((a, b) => a.price - b.price);
      case "distance":
        return sources.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      case "name":
        return sources.sort((a, b) => a.pharmacyName.localeCompare(b.pharmacyName));
      default:
        return sources;
    }
  }, [priceData, sortBy]);

  const lowestPriceSource = useMemo(() => {
    return sortedSources.find((s) => s.price === priceData?.lowestPrice);
  }, [sortedSources, priceData]);

  if (!priceData) {
    return (
      <ScreenScrollView>
        <View style={styles.emptyContainer}>
          <Feather name="dollar-sign" size={48} color={theme.textSecondary} />
          <ThemedText style={styles.emptyText}>
            No pricing data available for this medication
          </ThemedText>
        </View>
      </ScreenScrollView>
    );
  }

  const renderSortButton = (option: SortOption, label: string, icon: keyof typeof Feather.glyphMap) => (
    <Pressable
      style={[
        styles.sortButton,
        { backgroundColor: theme.backgroundSecondary },
        sortBy === option && { backgroundColor: theme.primary },
      ]}
      onPress={() => setSortBy(option)}
    >
      <Feather 
        name={icon} 
        size={16} 
        color={sortBy === option ? theme.buttonText : theme.text} 
      />
      <ThemedText
        style={[
          styles.sortButtonText,
          sortBy === option && { color: theme.buttonText },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );

  const renderPriceCard = (source: PriceSource, isLowest: boolean) => (
    <Pressable
      key={source.id}
      onPress={() => setSelectedPharmacy(source.id)}
    >
      <View
        style={[
          styles.priceCard,
          { backgroundColor: theme.card },
          selectedPharmacy === source.id && { borderColor: theme.primary },
        ]}
      >
        {isLowest && (
          <View style={[styles.lowestBadge, { backgroundColor: theme.primary }]}>
            <Feather name="award" size={14} color={theme.buttonText} />
            <ThemedText style={[styles.lowestBadgeText, { color: theme.buttonText }]}>Lowest Price</ThemedText>
          </View>
        )}
        
        <View style={styles.priceCardHeader}>
          <View style={styles.pharmacyInfo}>
            <Feather name="map-pin" size={20} color={theme.text} />
            <ThemedText style={styles.pharmacyName}>{source.pharmacyName}</ThemedText>
          </View>
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceSymbol}>$</ThemedText>
            <ThemedText style={styles.price}>
              {source.price.toFixed(2)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.priceCardDetails}>
          {source.distance !== undefined && (
            <View style={styles.detailRow}>
              <Feather name="navigation" size={16} color={theme.textSecondary} />
              <ThemedText style={styles.detailText}>
                {source.distance.toFixed(1)} mi away
              </ThemedText>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Feather 
              name={source.inStock ? "check-circle" : "x-circle"} 
              size={16} 
              color={source.inStock ? theme.success : theme.error} 
            />
            <ThemedText 
              style={[
                styles.detailText,
                { color: source.inStock ? theme.success : theme.error },
              ]}
            >
              {source.inStock ? "In Stock" : "Out of Stock"}
            </ThemedText>
          </View>
        </View>

        {selectedPharmacy === source.id && (
          <View style={[styles.selectedIndicator, { borderTopColor: theme.border }]}>
            <Feather name="check-circle" size={20} color={theme.primary} />
            <ThemedText style={[styles.selectedText, { color: theme.primary }]}>Selected</ThemedText>
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <ThemedText style={styles.medicationName}>
          {priceData.medication.name}
        </ThemedText>
        <ThemedText style={[styles.supply, { color: theme.textSecondary }]}>{priceData.supply}</ThemedText>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
        <View style={styles.summaryRow}>
          <View>
            <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>Lowest Price</ThemedText>
            <ThemedText style={styles.summaryValue}>
              ${priceData.lowestPrice.toFixed(2)}
            </ThemedText>
            {lowestPriceSource && (
              <ThemedText style={[styles.summaryPharmacy, { color: theme.textSecondary }]}>
                at {lowestPriceSource.pharmacyName}
              </ThemedText>
            )}
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
          <View>
            <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>Average Price</ThemedText>
            <ThemedText style={styles.summaryValue}>
              ${priceData.averagePrice.toFixed(2)}
            </ThemedText>
            <ThemedText style={[styles.summarySavings, { color: theme.success }]}>
              Save ${(priceData.averagePrice - priceData.lowestPrice).toFixed(2)}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.sortContainer}>
        <ThemedText style={styles.sortLabel}>Sort by:</ThemedText>
        <View style={styles.sortButtons}>
          {renderSortButton("price", "Price", "dollar-sign")}
          {renderSortButton("distance", "Distance", "map-pin")}
          {renderSortButton("name", "Name", "type")}
        </View>
      </View>

      <View style={styles.priceList}>
        <ThemedText style={styles.listTitle}>
          {sortedSources.length} Pharmacies Found
        </ThemedText>
        {sortedSources.map((source) =>
          renderPriceCard(source, source.id === lowestPriceSource?.id)
        )}
      </View>

      <View style={styles.footer}>
        <ThemedText style={[styles.footerNote, { color: theme.textSecondary }]}>
          Prices updated daily. Not including insurance coverage.
        </ThemedText>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  medicationName: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
  },
  supply: {
    fontSize: Typography.sizes.md,
    marginTop: Spacing.xs,
  },
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.xl,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 60,
  },
  summaryLabel: {
    fontSize: Typography.sizes.sm,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: Typography.sizes.xxl,
    fontWeight: "700",
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  summaryPharmacy: {
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xxs,
    textAlign: "center",
  },
  summarySavings: {
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.xxs,
    textAlign: "center",
    fontWeight: "600",
  },
  sortContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sortLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  sortButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  sortButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  priceList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  listTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  priceCard: {
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.xl,
  },
  selectedCard: {
  },
  lowestPriceCard: {
  },
  lowestBadge: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  lowestBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: "700",
  },
  priceCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  pharmacyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  pharmacyName: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  priceSymbol: {
    fontSize: Typography.sizes.md,
    fontWeight: "700",
    marginTop: 2,
  },
  price: {
    fontSize: Typography.sizes.xxl,
    fontWeight: "700",
  },
  priceCardDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.sizes.sm,
  },
  selectedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  selectedText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  footerNote: {
    fontSize: Typography.sizes.xs,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
  },
});
