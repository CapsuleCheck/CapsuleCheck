import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useAppointments } from "@/hooks/useAppDataHooks";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { BookingsStackParamList } from "@/navigation/BookingsStackNavigator";

type NavigationProp = NativeStackNavigationProp<BookingsStackParamList>;

export default function PrescriberBookingsScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const navigation = useNavigation<NavigationProp>();
  const appointments = useAppointments();

  // For now, show all appointments. In a real app, you'd filter by logged-in prescriber ID
  const bookings = appointments.all.filter((a) => a.status === "scheduled");

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

  const handleBookingPress = (bookingId: string) => {
    navigation.navigate("BookingDetails", { bookingId });
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

      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, { backgroundColor: theme.primary }]}
        >
          <ThemedText
            style={[styles.filterChipText, { color: theme.buttonText }]}
          >
            All
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.filterChip,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText style={styles.filterChipText}>Today</ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.filterChip,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText style={styles.filterChipText}>This Week</ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.filterChip,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText style={styles.filterChipText}>Pending</ThemedText>
        </Pressable>
      </View>

      <View style={styles.bookingsList}>
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              No bookings found
            </ThemedText>
          </View>
        ) : (
          bookings.map((booking) => (
            <Pressable
              key={booking.id}
              style={[
                styles.bookingCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => handleBookingPress(booking.id)}
            >
              <View style={styles.bookingHeader}>
                <View style={styles.bookingInfo}>
                  <ThemedText style={styles.patientName}>
                    {booking.patientName}
                  </ThemedText>
                  <ThemedText
                    style={[styles.bookingDate, { color: theme.textSecondary }]}
                  >
                    {formatDate(booking.date)}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(booking.status) + "20" },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.statusText,
                      { color: getStatusColor(booking.status) },
                    ]}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Feather name='clock' size={16} color={theme.textSecondary} />
                  <ThemedText
                    style={[styles.detailText, { color: theme.textSecondary }]}
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
                    style={[styles.detailText, { color: theme.textSecondary }]}
                  >
                    {getTypeText(booking.type)}
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
                    handleBookingPress(booking.id);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.actionButtonText,
                      { color: theme.buttonText },
                    ]}
                  >
                    View Details
                  </ThemedText>
                </Pressable>
              </View>
            </Pressable>
          ))
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
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
