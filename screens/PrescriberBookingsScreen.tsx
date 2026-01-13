import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { BookingsStackParamList } from "@/navigation/BookingsStackNavigator";
import { API_BASE_URL } from "@/constants/api";
import { usePrescriberProfile } from "@/hooks/useAppDataHooks";

type NavigationProp = NativeStackNavigationProp<BookingsStackParamList>;

type FilterType =
  | "all"
  | "today"
  | "thisWeek"
  | "pending"
  | "scheduled"
  | "completed"
  | "cancelled";

interface Booking {
  _id?: string;
  id?: string;
  prescriberId: string;
  patientId: string | { firstName?: string; lastName?: string; _id?: string };
  patientName?: string;
  date: string;
  time: string;
  type?: string;
  status?: string;
  meetingLink?: string;
  address?: string;
  reason?: string;
  notes?: string;
}

export default function PrescriberBookingsScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const navigation = useNavigation<NavigationProp>();
  const prescriberProfile = usePrescriberProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchBookings();
  }, [prescriberProfile?._id]);

  const fetchBookings = async () => {
    if (!prescriberProfile?._id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          prescriberId: prescriberProfile._id,
        },
      });

      // Handle different response formats
      const bookingsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.bookings || [];

      // Extract patient names if needed
      const processedBookings = bookingsData.map((booking: Booking) => {
        if (
          typeof booking.patientId === "object" &&
          booking.patientId !== null &&
          !booking.patientName
        ) {
          const patient = booking.patientId as {
            firstName?: string;
            lastName?: string;
          };
          booking.patientName =
            `${patient.firstName || ""} ${patient.lastName || ""}`.trim() ||
            "Patient";
        }
        return booking;
      });

      setBookings(processedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    switch (selectedFilter) {
      case "today":
        return bookings.filter((booking) => {
          const bookingDate = new Date(booking.date);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate.getTime() === today.getTime();
        });
      case "thisWeek":
        return bookings.filter((booking) => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= today && bookingDate <= endOfWeek;
        });
      case "pending":
        return bookings.filter(
          (booking) =>
            booking.status === "pending" || booking.status === "scheduled"
        );
      case "scheduled":
        return bookings.filter((booking) => booking.status === "scheduled");
      case "completed":
        return bookings.filter((booking) => booking.status === "completed");
      case "cancelled":
        return bookings.filter((booking) => booking.status === "cancelled");
      default:
        return bookings;
    }
  };

  const filteredBookings = filterBookings().sort((a, b) => {
    // Sort by date and time
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "video_call":
        return "Video Call";
      case "in_person":
        return "In-Person";
      case "phone_call":
        return "Phone Call";
      default:
        return type;
    }
  };

  const handleBookingPress = (booking: Booking) => {
    const bookingId = booking._id || booking.id || "";
    if (bookingId) {
      navigation.navigate("BookingDetails", { bookingId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return theme.success;
      case "completed":
        return theme.textSecondary;
      case "cancelled":
        return theme.error;
      case "no_show":
        return theme.warning;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <ScreenScrollView
      contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
    >
      <View style={[styles.header, { paddingTop: screenInsets.paddingTop }]}>
        <ThemedText style={styles.title}>Your Bookings</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Manage your upcoming appointments
        </ThemedText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <Pressable
          onPress={() => setSelectedFilter("all")}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                selectedFilter === "all"
                  ? theme.primary
                  : theme.backgroundSecondary,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.filterChipText,
              {
                color:
                  selectedFilter === "all"
                    ? theme.buttonText || "#FFFFFF"
                    : theme.text,
              },
            ]}
          >
            All ({bookings.length})
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setSelectedFilter("today")}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                selectedFilter === "today"
                  ? theme.primary
                  : theme.backgroundSecondary,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.filterChipText,
              {
                color:
                  selectedFilter === "today"
                    ? theme.buttonText || "#FFFFFF"
                    : theme.text,
              },
            ]}
          >
            Today
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setSelectedFilter("thisWeek")}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                selectedFilter === "thisWeek"
                  ? theme.primary
                  : theme.backgroundSecondary,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.filterChipText,
              {
                color:
                  selectedFilter === "thisWeek"
                    ? theme.buttonText || "#FFFFFF"
                    : theme.text,
              },
            ]}
          >
            This Week
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setSelectedFilter("pending")}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                selectedFilter === "pending"
                  ? theme.primary
                  : theme.backgroundSecondary,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.filterChipText,
              {
                color:
                  selectedFilter === "pending"
                    ? theme.buttonText || "#FFFFFF"
                    : theme.text,
              },
            ]}
          >
            Pending
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setSelectedFilter("completed")}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                selectedFilter === "completed"
                  ? theme.primary
                  : theme.backgroundSecondary,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.filterChipText,
              {
                color:
                  selectedFilter === "completed"
                    ? theme.buttonText || "#FFFFFF"
                    : theme.text,
              },
            ]}
          >
            Completed
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setSelectedFilter("cancelled")}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                selectedFilter === "cancelled"
                  ? theme.primary
                  : theme.backgroundSecondary,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.filterChipText,
              {
                color:
                  selectedFilter === "cancelled"
                    ? theme.buttonText || "#FFFFFF"
                    : theme.text,
              },
            ]}
          >
            Cancelled
          </ThemedText>
        </Pressable>
      </ScrollView>

      <View style={styles.bookingsList}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size='large' color={theme.primary} />
            <ThemedText
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              Loading bookings...
            </ThemedText>
          </View>
        ) : filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name='inbox' size={48} color={theme.textSecondary} />
            <ThemedText
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              {selectedFilter === "all"
                ? "No bookings found"
                : `No ${selectedFilter.replace(/([A-Z])/g, " $1").toLowerCase()} bookings`}
            </ThemedText>
          </View>
        ) : (
          filteredBookings.map((booking) => {
            const bookingId = booking._id || booking.id || "";
            return (
              <Pressable
                key={bookingId}
                style={({ pressed }) => [
                  styles.bookingCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => handleBookingPress(booking)}
              >
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingInfo}>
                    <ThemedText style={styles.patientName}>
                      {booking.patientName || "Patient"}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.bookingDate,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {formatDate(booking.date)}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          getStatusColor(booking.status || "") + "20",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: getStatusColor(booking.status || ""),
                        },
                      ]}
                    />
                    <ThemedText
                      style={[
                        styles.statusText,
                        { color: getStatusColor(booking.status || "") },
                      ]}
                    >
                      {(booking.status || "").charAt(0).toUpperCase() +
                        (booking.status || "").slice(1)}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Feather
                      name='clock'
                      size={16}
                      color={theme.textSecondary}
                    />
                    <ThemedText
                      style={[
                        styles.detailText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {booking.time}
                    </ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <Feather
                      name={
                        booking.type === "video_call"
                          ? "video"
                          : booking.type === "in_person"
                            ? "user"
                            : "phone"
                      }
                      size={16}
                      color={theme.textSecondary}
                    />
                    <ThemedText
                      style={[
                        styles.detailText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {getTypeText(booking.type || "")}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Pressable
                    style={[
                      styles.actionButton,
                      { backgroundColor: theme.backgroundSecondary },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      // TODO: Handle reschedule
                    }}
                  >
                    <ThemedText style={styles.actionButtonText}>
                      Reschedule
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.actionButton,
                      { backgroundColor: theme.primary },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleBookingPress(booking);
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.actionButtonText,
                        { color: theme.buttonText || "#FFFFFF" },
                      ]}
                    >
                      View Details
                    </ThemedText>
                  </Pressable>
                </View>
              </Pressable>
            );
          })
        )}
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
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    paddingRight: Spacing.xl,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  filterChipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500",
  },
  bookingsList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  bookingCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    marginBottom: Spacing.xxs,
  },
  bookingDate: {
    fontSize: Typography.sizes.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: "600",
  },
  bookingDetails: {
    flexDirection: "row",
    gap: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.sizes.sm,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
  },
});
