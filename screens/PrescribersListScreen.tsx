import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { Prescriber } from "@/types/data";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function PrescribersListScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const screenInsets = useScreenInsets();
  const [prescribers, setPrescribers] = useState<Prescriber[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrescribers();
  }, []);

  const fetchPrescribers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.prescribers}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("sds", response.data);
      // Handle both array response and object with data property
      const prescribersData = response.data?.data ?? [];
      console.log({ prescribersData });
      setPrescribers([...prescribersData]);
    } catch (err) {
      console.error("Error fetching prescribers:", err);
      let errorMessage = "Failed to load prescribers. Please try again.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage =
            err.response.data?.message ||
            `Failed to load prescribers: ${err.response.status}`;
        } else if (err.request) {
          errorMessage =
            "Unable to connect to server. Please check your connection.";
        }
      }

      setError(errorMessage);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter prescribers based on search query
  const filteredPrescribers = searchQuery
    ? prescribers.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.specialty.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : prescribers;
  //     : prescribers.filter((p) => p.acceptingNewPatients);

  const handlePrescriberPress = (prescriber: Prescriber) => {
    navigation.navigate("BookAppointment", {
      prescriberId: prescriber._id,
      prescriber,
    });
  };

  return (
    <ScreenScrollView
      contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
    >
      <View style={styles.content}>
        <View style={styles.searchContainer}>
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
              style={[styles.searchInput, { color: theme.text }]}
              placeholder='Search prescribers...'
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name='x' size={20} color={theme.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size='large' color={theme.primary} />
            <ThemedText
              style={[styles.loadingText, { color: theme.textSecondary }]}
            >
              Loading prescribers...
            </ThemedText>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Feather
              name='alert-circle'
              size={48}
              color={theme.error || theme.textSecondary}
            />
            <ThemedText
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              {error}
            </ThemedText>
            <Pressable
              onPress={fetchPrescribers}
              style={({ pressed }) => [
                styles.retryButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </Pressable>
          </View>
        ) : filteredPrescribers.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name='user-x' size={48} color={theme.textSecondary} />
            <ThemedText
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              {searchQuery
                ? "No prescribers found matching your search"
                : "No prescribers available at the moment"}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredPrescribers.map((prescriber) => (
              <Pressable
                key={prescriber._id}
                onPress={() => handlePrescriberPress(prescriber)}
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
                    styles.avatar,
                    { backgroundColor: theme.primary + "20" },
                  ]}
                >
                  <Feather name='user' size={24} color={theme.primary} />
                </View>
                <View style={styles.details}>
                  <ThemedText style={styles.name}>
                    {prescriber.name} {prescriber.title}
                  </ThemedText>
                  <ThemedText
                    style={[styles.specialty, { color: theme.textSecondary }]}
                  >
                    {/* {prescriber.specialty.join(", ")} */}
                  </ThemedText>
                  <View style={styles.ratingRow}>
                    <Feather name='star' size={14} color='#F59E0B' />
                    <ThemedText style={styles.rating}>
                      {prescriber.ratings.toFixed(1)}
                    </ThemedText>
                    <ThemedText
                      style={[styles.reviews, { color: theme.textSecondary }]}
                    >
                      ({prescriber.ratingsCount} reviews)
                    </ThemedText>
                  </View>
                  {prescriber.consultationFee && (
                    <ThemedText style={[styles.fee, { color: theme.primary }]}>
                      ${prescriber?.consultationFee ?? 0} consultation fee
                    </ThemedText>
                  )}
                </View>
                <Feather
                  name='chevron-right'
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    gap: Spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  specialty: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviews: {
    fontSize: 14,
  },
  fee: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyText: {
    fontSize: 16,
    marginTop: Spacing.md,
    textAlign: "center",
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  loadingText: {
    fontSize: 16,
    marginTop: Spacing.md,
    textAlign: "center",
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
