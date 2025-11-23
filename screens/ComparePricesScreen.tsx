import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
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

type SortOption = "price-low" | "price-high" | "distance" | "name";
type FilterType = "all" | "generic" | "brand";

export default function ComparePricesScreen() {
  const route = useRoute<ComparePricesScreenRouteProp>();
  const navigation = useNavigation<ComparePricesScreenNavigationProp>();
  const { theme } = useTheme();
  const { medicationId } = route.params;
  const medicationPrices = useMedicationPrices();
  
  const [sortBy, setSortBy] = useState<SortOption>("price-low");
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);

  const priceData = medicationPrices.getByMedicationId(medicationId);
  const NEARBY_DISTANCE_THRESHOLD = 5;

  const hasActiveFilters = useMemo(() => {
    return inStockOnly || nearbyOnly || filterType !== "all" || minRating !== null;
  }, [inStockOnly, nearbyOnly, filterType, minRating]);

  const filteredAndSortedSources = useMemo(() => {
    if (!priceData) return [];
    
    let sources = [...priceData.sources];
    
    if (inStockOnly) {
      sources = sources.filter(s => s.inStock);
    }
    
    if (nearbyOnly) {
      sources = sources.filter(s => s.distance !== undefined && s.distance <= NEARBY_DISTANCE_THRESHOLD);
    }
    
    if (filterType === "generic") {
      sources = sources.filter(s => s.isGenericOffer === true);
    } else if (filterType === "brand") {
      sources = sources.filter(s => s.isGenericOffer === false || s.isGenericOffer === undefined);
    }
    
    if (minRating !== null) {
      sources = sources.filter(s => s.patientRating !== undefined && s.patientRating >= minRating);
    }
    
    switch (sortBy) {
      case "price-low":
        return sources.sort((a, b) => a.price - b.price);
      case "price-high":
        return sources.sort((a, b) => b.price - a.price);
      case "distance":
        return sources.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      case "name":
        return sources.sort((a, b) => a.pharmacyName.localeCompare(b.pharmacyName));
      default:
        return sources;
    }
  }, [priceData, sortBy, filterType, inStockOnly, nearbyOnly, minRating]);

  const filteredLowestPrice = useMemo(() => {
    if (filteredAndSortedSources.length === 0) return null;
    return Math.min(...filteredAndSortedSources.map(s => s.price));
  }, [filteredAndSortedSources]);

  const filteredLowestPriceSource = useMemo(() => {
    if (!filteredLowestPrice) return null;
    return filteredAndSortedSources.find((s) => s.price === filteredLowestPrice);
  }, [filteredAndSortedSources, filteredLowestPrice]);

  const filteredAveragePrice = useMemo(() => {
    if (filteredAndSortedSources.length === 0) return null;
    const total = filteredAndSortedSources.reduce((sum, s) => sum + s.price, 0);
    return total / filteredAndSortedSources.length;
  }, [filteredAndSortedSources]);

  useEffect(() => {
    if (selectedPharmacy && !filteredAndSortedSources.some(s => s.id === selectedPharmacy)) {
      setSelectedPharmacy(null);
    }
  }, [filteredAndSortedSources, selectedPharmacy]);

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

  const AnimatedSortButton = ({ option, label, icon }: { option: SortOption; label: string; icon: keyof typeof Feather.glyphMap }) => {
    const scale = useSharedValue(1);
    const isActive = sortBy === option;

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    return (
      <Pressable
        onPress={() => setSortBy(option)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.sortButton,
            { backgroundColor: theme.backgroundSecondary },
            isActive && { backgroundColor: theme.primary },
            animatedStyle,
          ]}
        >
          <Feather name={icon} size={16} color={isActive ? theme.buttonText : theme.text} />
          <ThemedText style={[styles.sortButtonText, isActive && { color: theme.buttonText }]}>
            {label}
          </ThemedText>
        </Animated.View>
      </Pressable>
    );
  };

  const AnimatedFilterChip = ({ active, label, icon, onPress }: { active: boolean; label: string; icon: keyof typeof Feather.glyphMap; onPress: () => void }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    return (
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View
          style={[
            styles.filterChip,
            { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
            active && { backgroundColor: theme.primary, borderColor: theme.primary },
            animatedStyle,
          ]}
        >
          <Feather name={icon} size={14} color={active ? theme.buttonText : theme.text} />
          <ThemedText style={[styles.filterChipText, active && { color: theme.buttonText }]}>
            {label}
          </ThemedText>
        </Animated.View>
      </Pressable>
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Feather key={`full-${i}`} name="star" size={12} color={theme.warning} style={{ marginRight: 2 }} />);
    }
    if (hasHalfStar) {
      stars.push(<Feather key="half" name="star" size={12} color={theme.textSecondary} style={{ marginRight: 2 }} />);
    }
    return stars;
  };

  const renderPriceCard = (source: PriceSource, isFilteredLowest: boolean) => {
    return (
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
          {isFilteredLowest && (
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
            {source.patientRating !== undefined && (
              <View style={styles.detailRow}>
                <View style={styles.ratingContainer}>
                  {renderStars(source.patientRating)}
                  <ThemedText style={styles.ratingText}>
                    {source.patientRating.toFixed(1)}
                  </ThemedText>
                </View>
              </View>
            )}
            
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
  };

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <ThemedText style={styles.medicationName}>
          {priceData.medication.name}
        </ThemedText>
        <ThemedText style={[styles.supply, { color: theme.textSecondary }]}>{priceData.supply}</ThemedText>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
        {filteredAndSortedSources.length === 0 ? (
          <View style={styles.emptySummaryContainer}>
            <Feather name="info" size={24} color={theme.textSecondary} />
            <ThemedText style={[styles.emptySummaryText, { color: theme.textSecondary }]}>
              No matching pharmacies found. Clear filters to see all prices.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.summaryRow}>
            <View>
              <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                {hasActiveFilters && filteredLowestPrice !== null ? "Lowest (Filtered)" : "Lowest Price"}
              </ThemedText>
              <ThemedText style={styles.summaryValue}>
                ${(filteredLowestPrice !== null ? filteredLowestPrice : priceData.lowestPrice).toFixed(2)}
              </ThemedText>
              {filteredLowestPriceSource ? (
                <ThemedText style={[styles.summaryPharmacy, { color: theme.textSecondary }]}>
                  at {filteredLowestPriceSource.pharmacyName}
                </ThemedText>
              ) : null}
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
            <View>
              <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                {hasActiveFilters && filteredAveragePrice !== null ? "Average (Filtered)" : "Average Price"}
              </ThemedText>
              <ThemedText style={styles.summaryValue}>
                ${(filteredAveragePrice !== null ? filteredAveragePrice : priceData.averagePrice).toFixed(2)}
              </ThemedText>
              {filteredLowestPrice !== null && filteredAveragePrice !== null ? (
                <ThemedText style={[styles.summarySavings, { color: theme.success }]}>
                  Save ${(filteredAveragePrice - filteredLowestPrice).toFixed(2)}
                </ThemedText>
              ) : (
                <ThemedText style={[styles.summarySavings, { color: theme.success }]}>
                  Save ${(priceData.averagePrice - priceData.lowestPrice).toFixed(2)}
                </ThemedText>
              )}
            </View>
          </View>
        )}
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <ThemedText style={styles.sectionLabel}>Filters:</ThemedText>
          {hasActiveFilters && (
            <Pressable
              style={styles.clearAllButton}
              onPress={() => {
                setFilterType("all");
                setInStockOnly(false);
                setNearbyOnly(false);
                setMinRating(null);
              }}
            >
              <ThemedText style={[styles.clearAllText, { color: theme.primary }]}>
                Clear All
              </ThemedText>
            </Pressable>
          )}
        </View>
        <View style={styles.filterChips}>
          <AnimatedFilterChip active={filterType === "all"} label="All" icon="grid" onPress={() => setFilterType("all")} />
          {priceData.medication.genericName && (
            <AnimatedFilterChip
              active={filterType === "generic"}
              label="Generic"
              icon="package"
              onPress={() => setFilterType("generic")}
            />
          )}
          <AnimatedFilterChip active={filterType === "brand"} label="Brand" icon="award" onPress={() => setFilterType("brand")} />
          <AnimatedFilterChip active={inStockOnly} label="In Stock" icon="check-circle" onPress={() => setInStockOnly(!inStockOnly)} />
          <AnimatedFilterChip active={nearbyOnly} label="Nearby" icon="navigation" onPress={() => setNearbyOnly(!nearbyOnly)} />
        </View>
      </View>

      <View style={styles.filterSection}>
        <ThemedText style={styles.sectionLabel}>Patient Ratings:</ThemedText>
        <View style={styles.filterChips}>
          <AnimatedFilterChip active={minRating === null} label="All Ratings" icon="star" onPress={() => setMinRating(null)} />
          <AnimatedFilterChip active={minRating === 4} label="4+ Stars" icon="star" onPress={() => setMinRating(4)} />
          <AnimatedFilterChip active={minRating === 3} label="3+ Stars" icon="star" onPress={() => setMinRating(3)} />
        </View>
      </View>

      <View style={styles.sortContainer}>
        <ThemedText style={styles.sortLabel}>Sort by:</ThemedText>
        <View style={styles.sortButtons}>
          <AnimatedSortButton option="price-low" label="Price: Low" icon="arrow-down" />
          <AnimatedSortButton option="price-high" label="Price: High" icon="arrow-up" />
          <AnimatedSortButton option="distance" label="Distance" icon="map-pin" />
          <AnimatedSortButton option="name" label="Name" icon="type" />
        </View>
      </View>

      <View style={styles.priceList}>
        <ThemedText style={styles.listTitle}>
          {filteredAndSortedSources.length} {filteredAndSortedSources.length === 1 ? "Pharmacy" : "Pharmacies"} Found
        </ThemedText>
        {filteredAndSortedSources.length === 0 ? (
          <View style={styles.emptyFilterContainer}>
            <Feather name="filter" size={48} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyFilterText, { color: theme.textSecondary }]}>
              No pharmacies match your current filters
            </ThemedText>
            <Pressable
              style={[styles.clearFiltersButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                setFilterType("all");
                setInStockOnly(false);
                setNearbyOnly(false);
                setMinRating(null);
              }}
            >
              <ThemedText style={[styles.clearFiltersText, { color: theme.buttonText }]}>
                Clear Filters
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <React.Fragment>
            {filteredAndSortedSources.map((source) => {
              const isLowestInFiltered = filteredLowestPriceSource ? source.id === filteredLowestPriceSource.id : false;
              return renderPriceCard(source, isLowestInFiltered);
            })}
          </React.Fragment>
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
    marginLeft: Spacing.xs,
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
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  clearAllButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  clearAllText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  emptyFilterContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyFilterText: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  clearFiltersButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.sm,
  },
  clearFiltersText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  emptySummaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  emptySummaryText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
});
