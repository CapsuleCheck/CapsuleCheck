import React, { useState } from "react";
import { View, StyleSheet, Pressable, Switch, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

const UPCOMING_BOOKINGS = [
  {
    id: "1",
    patientName: "Arthur Morgan",
    startTime: "11:30 AM",
    endTime: "11:45 AM",
    type: "Video Call",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    patientName: "Sadie Adler",
    startTime: "01:00 PM",
    endTime: "01:15 PM",
    type: "In-Person",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
];

const DOCTOR_AVATAR =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face";

export default function PrescriberHomeScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const [isOnline, setIsOnline] = useState(true);

  const handleViewDetails = (bookingId: string) => {
    // TODO: Navigate to booking details screen
    console.log("View details for booking:", bookingId);
  };

  const handleManageAvailability = () => {
    // TODO: Navigate to availability management screen
    console.log("Manage availability");
  };

  const handleUpdatePricing = () => {
    // TODO: Navigate to medication pricing screen
    console.log("Update medication pricing");
  };

  return (
    <ScreenScrollView
      contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
    >
      {/* Header with Avatar and Greeting */}
      <View style={[styles.header, { paddingTop: screenInsets.paddingTop }]}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: DOCTOR_AVATAR }}
            style={[styles.doctorAvatar, { borderColor: theme.primary }]}
          />
          <ThemedText style={styles.greeting}>
            Good Morning, Dr. Smith
          </ThemedText>
        </View>
        <Pressable style={styles.notificationButton}>
          <Feather name="bell" size={24} color={theme.text} />
          <View style={[styles.badge, { backgroundColor: theme.error }]}>
            <ThemedText style={styles.badgeText}>2</ThemedText>
          </View>
        </Pressable>
      </View>

      {/* Availability Toggle Card */}
      <View
        style={[
          styles.availabilityCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.availabilityContent}>
          <ThemedText style={styles.availabilityTitle}>
            Available for Consultations
          </ThemedText>
          <ThemedText
            style={[
              styles.availabilitySubtitle,
              { color: theme.textSecondary },
            ]}
          >
            Toggle to go online or offline
          </ThemedText>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{
              false: theme.backgroundTertiary,
              true: theme.success,
            }}
            thumbColor="#FFFFFF"
            style={styles.toggleSwitch}
          />
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText
            style={[styles.statLabel, { color: theme.textSecondary }]}
          >
            Today's Bookings
          </ThemedText>
          <ThemedText style={styles.statValue}>5</ThemedText>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText
            style={[styles.statLabel, { color: theme.textSecondary }]}
          >
            Pending Requests
          </ThemedText>
          <View style={styles.statWithBadge}>
            <ThemedText style={styles.statValue}>2</ThemedText>
            <View
              style={[styles.pendingBadge, { backgroundColor: theme.warning }]}
            />
          </View>
        </View>
      </View>

      {/* Upcoming Bookings Section */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Upcoming Bookings</ThemedText>

        {UPCOMING_BOOKINGS.map((booking) => (
          <View
            key={booking.id}
            style={[
              styles.bookingCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.bookingInfo}>
              <ThemedText style={styles.patientName}>
                {booking.patientName}
              </ThemedText>
              <ThemedText
                style={[styles.bookingDetail, { color: theme.textSecondary }]}
              >
                {booking.type}: {booking.startTime} - {booking.endTime}
              </ThemedText>
              <Pressable
                style={[
                  styles.viewDetailsButton,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
                onPress={() => handleViewDetails(booking.id)}
              >
                <ThemedText style={styles.viewDetailsText}>
                  View Details
                </ThemedText>
                <Feather name="arrow-right" size={14} color={theme.text} />
              </Pressable>
            </View>
            <Image
              source={{ uri: booking.avatar }}
              style={styles.patientAvatar}
            />
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <Pressable
          style={[
            styles.primaryActionButton,
            { backgroundColor: theme.success },
          ]}
          onPress={handleManageAvailability}
        >
          <Feather name="calendar" size={20} color="#FFFFFF" />
          <ThemedText style={styles.primaryActionText}>
            Manage Availability
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.outlineActionButton, { borderColor: theme.success }]}
          onPress={handleUpdatePricing}
        >
          <Feather name="plus-square" size={20} color={theme.success} />
          <ThemedText
            style={[styles.outlineActionText, { color: theme.success }]}
          >
            Update Medication Pricing
          </ThemedText>
        </Pressable>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  greeting: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  availabilityCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
  },
  availabilityContent: {
    alignItems: "flex-start",
  },
  availabilityTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  availabilitySubtitle: {
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  toggleSwitch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
  },
  statWithBadge: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pendingBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: Spacing.xs,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },
  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  bookingDetail: {
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  viewDetailsText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500",
  },
  patientAvatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
  },
  actionsSection: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  primaryActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  outlineActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    gap: Spacing.sm,
  },
  outlineActionText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
});
