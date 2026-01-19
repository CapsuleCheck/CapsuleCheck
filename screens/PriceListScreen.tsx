import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ScreenFlatList } from "@/components/ScreenFlatList";
import { ThemedText } from "@/components/ThemedText";
import { MedicationCard } from "@/components/MedicationCard";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type PriceListScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "PriceList"
>;

const MOCK_MEDICATIONS = [
  {
    id: "med-2",
    name: "Lisinopril",
    supply: "30-day supply, 10mg",
    type: "Tablet",
    price: "$4.99",
    sources: 5,
  },
  {
    id: "med-1",
    name: "Atorvastatin",
    supply: "30-day supply, 20mg",
    type: "Tablet",
    price: "$8.50",
    sources: 6,
  },
  {
    id: "med-3",
    name: "Metformin",
    supply: "60-day supply, 500mg",
    type: "Tablet",
    price: "$6.25",
    sources: 6,
  },
  {
    id: "med-4",
    name: "Amlodipine",
    supply: "30-day supply, 5mg",
    type: "Tablet",
    price: "$5.80",
    sources: 0,
  },
  {
    id: "med-5",
    name: "Omeprazole",
    supply: "30-day supply, 20mg",
    type: "Capsule",
    price: "$9.10",
    sources: 0,
  },
];

export default function PriceListScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<PriceListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "price" | "generic" | null
  >("price");

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.searchContainer, { paddingTop: insets.top }]}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <Feather name='search' size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder='Search medication...'
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>

        <View style={styles.filtersRow}>
          <Pressable
            onPress={() =>
              setSelectedFilter(selectedFilter === "price" ? null : "price")
            }
            style={({ pressed }) => [
              styles.filterChip,
              {
                backgroundColor:
                  selectedFilter === "price"
                    ? theme.primary + "20"
                    : theme.backgroundSecondary,
                borderColor:
                  selectedFilter === "price" ? theme.primary : theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather
              name='filter'
              size={16}
              color={selectedFilter === "price" ? theme.primary : theme.text}
            />
            <ThemedText
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === "price" ? theme.primary : theme.text,
                },
              ]}
            >
              Filters
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.filterChip,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather name='arrow-down' size={16} color={theme.text} />
            <ThemedText style={styles.filterText}>
              Price: Low to High
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() =>
              setSelectedFilter(selectedFilter === "generic" ? null : "generic")
            }
            style={({ pressed }) => [
              styles.filterChip,
              {
                backgroundColor:
                  selectedFilter === "generic"
                    ? theme.primary + "20"
                    : theme.backgroundSecondary,
                borderColor:
                  selectedFilter === "generic" ? theme.primary : theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === "generic" ? theme.primary : theme.text,
                },
              ]}
            >
              Generic
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <ScreenFlatList
        data={MOCK_MEDICATIONS}
        renderItem={({ item }) => (
          <MedicationCard
            name={item.name}
            supply={item.supply}
            type={item.type}
            price={item.price}
            sources={item.sources}
            onPress={() =>
              navigation.navigate("ComparePrices", { medicationId: item.id })
            }
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: Spacing.xl,
          paddingTop: Spacing.sm,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 16,
  },
  filtersRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
