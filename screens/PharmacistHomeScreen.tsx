import React, { useState } from "react";
import { View, StyleSheet, Pressable, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing } from "@/constants/theme";

const UPCOMING_BOOKINGS = [
  {
    id: "1",
    patientName: "Arthur Morgan",
    time: "11:30 AM",
    type: "Video Call",
  },
  {
    id: "2",
    patientName: "Sadie Adler",
    time: "01:00 PM",
    type: "In-Person",
  },
];

export default function PharmacistHomeScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <ScreenScrollView contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}>
      <View style={[styles.header, { paddingTop: screenInsets.paddingTop }]}>
        <View>
          <ThemedText style={[styles.greeting, { color: theme.textSecondary }]}>
            Good morning,
          </ThemedText>
          <ThemedText style={styles.name}>Dr. Evelyn Reed</ThemedText>
        </View>
        <Pressable style={styles.notificationButton}>
          <Feather name="bell" size={24} color={theme.text} />
          <View style={[styles.badge, { backgroundColor: theme.error }]}>
            <ThemedText style={styles.badgeText}>2</ThemedText>
          </View>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.availabilityHeader}>
          <ThemedText style={styles.cardTitle}>Your Availability</ThemedText>
          <ThemedText style={[styles.statusText, { color: theme.textSecondary }]}>
            You are currently {isOnline ? "online" : "offline"}
          </ThemedText>
        </View>
        <Switch
          value={isOnline}
          onValueChange={setIsOnline}
          trackColor={{ false: theme.backgroundTertiary, true: theme.success }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
            Today's Bookings
          </ThemedText>
          <ThemedText style={styles.statValue}>5</ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
            Pending Requests
          </ThemedText>
          <View style={styles.statWithBadge}>
            <ThemedText style={styles.statValue}>2</ThemedText>
            <View style={[styles.pendingBadge, { backgroundColor: theme.warning }]} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Upcoming Bookings</ThemedText>
          <Pressable>
            <ThemedText style={[styles.viewAll, { color: theme.primary }]}>
              View All
            </ThemedText>
          </Pressable>
        </View>

        {UPCOMING_BOOKINGS.map((booking) => (
          <Pressable
            key={booking.id}
            style={({ pressed }) => [
              styles.bookingCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.bookingContent}>
              <ThemedText style={styles.patientName}>{booking.patientName}</ThemedText>
              <ThemedText style={[styles.bookingDetail, { color: theme.textSecondary }]}>
                {booking.time} • {booking.type}
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        ))}
      </View>

      <View style={styles.actionsSection}>
        <PrimaryButton
          title="Manage Availability"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <PrimaryButton
          title="Update Medication Pricing"
          onPress={() => {}}
          variant="outline"
          style={styles.actionButton}
        />
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
  greeting: {
    fontSize: 14,
  },
  name: {
    fontSize: 20,
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
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  card: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  availabilityHeader: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  statusText: {
    fontSize: 14,
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
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  statWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  pendingBadge: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "500",
  },
  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  bookingContent: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  bookingDetail: {
    fontSize: 14,
  },
  actionsSection: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    width: "100%",
  },
});

