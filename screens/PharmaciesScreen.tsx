import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ScreenFlatList } from "@/components/ScreenFlatList";
import { PrescriberCard } from "@/components/PrescriberCard";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { Spacing } from "@/constants/theme";
import { PharmaciesStackParamList } from "@/navigation/PharmaciesStackNavigator";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { Prescriber } from "@/types/data";

type NavigationProp = NativeStackNavigationProp<PharmaciesStackParamList>;

export default function PharmaciesScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { token } = useUser();
  const [prescribers, setPrescribers] = useState<Prescriber[]>([]);
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
            ...(token && {
              Authorization: token.startsWith("Bearer ")
                ? token
                : `Bearer ${token}`,
            }),
          },
        }
      );
      const prescribersData = response.data?.data ?? [];
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

  const handlePrescriberPress = (prescriber: Prescriber) => {
    navigation.navigate("BookAppointment", {
      prescriberId: prescriber._id,
      prescriber,
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading prescribers...
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText style={[styles.errorText, { color: theme.error }]}>
          {error}
        </ThemedText>
        <Pressable
          onPress={fetchPrescribers}
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
        >
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <ScreenFlatList
      data={prescribers}
      renderItem={({ item }) => (
        <PrescriberCard
          name={`${item.name} ${item.title || ""}`.trim()}
          rating={item.ratings ?? 0}
          reviews={item.ratingsCount ?? 0}
          time="—"
          type={item.specialty?.[0] ?? "Consultation"}
          onPress={() => handlePrescriberPress(item)}
        />
      )}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingHorizontal: Spacing.xl }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
  },
  errorText: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
