import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

const BOOKINGS = [
  {
    id: "1",
    patientName: "Arthur Morgan",
    date: "Today",
    startTime: "11:30 AM",
    endTime: "11:45 AM",
    type: "Video Call",
    status: "confirmed",
  },
  {
    id: "2",
    patientName: "Sadie Adler",
    date: "Today",
    startTime: "01:00 PM",
    endTime: "01:15 PM",
    type: "In-Person",
    status: "confirmed",
  },
  {
    id: "3",
    patientName: "John Marston",
    date: "Tomorrow",
    startTime: "09:00 AM",
    endTime: "09:30 AM",
    type: "Video Call",
    status: "pending",
  },
  {
    id: "4",
    patientName: "Abigail Roberts",
    date: "Tomorrow",
    startTime: "02:00 PM",
    endTime: "02:15 PM",
    type: "In-Person",
    status: "confirmed",
  },
];

export default function PrescriberBookingsScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return theme.success;
      case "pending":
        return theme.warning;
      case "cancelled":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <ScreenScrollView contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}>
      <View style={[styles.header, { paddingTop: screenInsets.paddingTop }]}>
        <ThemedText style={styles.title}>Your Bookings</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Manage your upcoming appointments
        </ThemedText>
      </View>

      <View style={styles.filterRow}>
        <Pressable style={[styles.filterChip, { backgroundColor: theme.primary }]}>
          <ThemedText style={[styles.filterChipText, { color: theme.buttonText }]}>All</ThemedText>
        </Pressable>
        <Pressable style={[styles.filterChip, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={styles.filterChipText}>Today</ThemedText>
        </Pressable>
        <Pressable style={[styles.filterChip, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={styles.filterChipText}>This Week</ThemedText>
        </Pressable>
        <Pressable style={[styles.filterChip, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={styles.filterChipText}>Pending</ThemedText>
        </Pressable>
      </View>

      <View style={styles.bookingsList}>
        {BOOKINGS.map((booking) => (
          <Pressable
            key={booking.id}
            style={[styles.bookingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={styles.bookingHeader}>
              <View style={styles.bookingInfo}>
                <ThemedText style={styles.patientName}>{booking.patientName}</ThemedText>
                <ThemedText style={[styles.bookingDate, { color: theme.textSecondary }]}>
                  {booking.date}
                </ThemedText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + "20" }]}>
                <ThemedText style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </ThemedText>
              </View>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Feather name="clock" size={16} color={theme.textSecondary} />
                <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
                  {booking.startTime} - {booking.endTime}
                </ThemedText>
              </View>
              <View style={styles.detailRow}>
                <Feather name={booking.type === "Video Call" ? "video" : "user"} size={16} color={theme.textSecondary} />
                <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
                  {booking.type}
                </ThemedText>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Pressable style={[styles.actionButton, { backgroundColor: theme.backgroundSecondary }]}>
                <ThemedText style={styles.actionButtonText}>Reschedule</ThemedText>
              </Pressable>
              <Pressable style={[styles.actionButton, { backgroundColor: theme.primary }]}>
                <ThemedText style={[styles.actionButtonText, { color: theme.buttonText }]}>
                  {booking.type === "Video Call" ? "Join Call" : "View Details"}
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
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
});
