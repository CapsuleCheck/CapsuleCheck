import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Switch,
  Image,
  ActivityIndicator,
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
import { usePrescriberProfile } from "@/hooks/useAppDataHooks";
import { API_BASE_URL } from "@/constants/api";
import { MainTabParamList } from "@/navigation/MainTabNavigator";

interface Booking {
  _id?: string;
  id?: string;
  prescriberId: string;
  patientId: { firstName?: string; lastName?: string; _id?: string };
  date: string;
  time: string;
  type?: string;
  status?: string;
  meetingLink?: string;
}

const DOCTOR_AVATAR =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face";

type NavigationProp = NativeStackNavigationProp<MainTabParamList>;

export default function PrescriberHomeScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const navigation = useNavigation<NavigationProp>();
  const [isOnline, setIsOnline] = useState(true);
  const prescriberProfile = usePrescriberProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [prescriberProfile?._id]);

  const fetchBookings = async () => {
    if (!prescriberProfile?._id) {
      setIsLoadingBookings(false);
      return;
    }

    setIsLoadingBookings(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          prescriberId: prescriberProfile._id,
        },
      });

      // Handle both array response and object with data property
      const bookingsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.bookings || [];

      setBookings(bookingsData);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      // On error, set empty array to show no bookings
      setBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Filter upcoming bookings (future dates or today's future times)
  const getUpcomingBookings = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return bookings
      .filter((booking) => {
        const bookingDate = new Date(booking.date);
        const bookingDateTime = new Date(bookingDate);

        // Parse time (assuming format like "10:00 AM" or "02:00 PM")
        const timeMatch = booking.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1], 10);
          const minutes = parseInt(timeMatch[2], 10);
          const period = timeMatch[3].toUpperCase();

          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;

          bookingDateTime.setHours(hours, minutes, 0, 0);
        }
        // Check if booking is in the future
        return bookingDateTime >= now && booking.status !== "cancelled";
      })
      .sort((a, b) => {
        // Sort by date and time
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5); // Limit to 5 upcoming bookings
  };

  const upcomingBookings = getUpcomingBookings();

  // Get today's bookings count
  const getTodaysBookingsCount = () => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter(
      (booking) => booking.date === today && booking.status !== "cancelled"
    ).length;
  };

  // Get pending requests count (bookings with pending status)
  const getPendingRequestsCount = () => {
    return bookings.filter(
      (booking) =>
        booking.status === "pending" || booking.status === "scheduled"
    ).length;
  };

  const handleViewDetails = (bookingId: string) => {
    // Navigate to BookingsTab and then to BookingDetails screen
    (navigation as any).navigate("BookingsTab", {
      screen: "BookingDetails",
      params: { bookingId },
    });
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
            {prescriberProfile
              ? `Good Morning, Prescriber ${prescriberProfile.name.split(" ")[0]}`
              : "Good Morning"}
          </ThemedText>
        </View>
        <Pressable style={styles.notificationButton}>
          <Feather name='bell' size={24} color={theme.text} />
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
            thumbColor='#FFFFFF'
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
          <ThemedText style={styles.statValue}>
            {isLoadingBookings ? "-" : getTodaysBookingsCount()}
          </ThemedText>
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
            <ThemedText style={styles.statValue}>
              {isLoadingBookings ? "-" : getPendingRequestsCount()}
            </ThemedText>
            {!isLoadingBookings && getPendingRequestsCount() > 0 && (
              <View
                style={[
                  styles.pendingBadge,
                  { backgroundColor: theme.warning },
                ]}
              />
            )}
          </View>
        </View>
      </View>

      {/* Upcoming Bookings Section */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Upcoming Bookings</ThemedText>

        {isLoadingBookings ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color={theme.primary} />
            <ThemedText
              style={[styles.loadingText, { color: theme.textSecondary }]}
            >
              Loading bookings...
            </ThemedText>
          </View>
        ) : upcomingBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name='calendar' size={48} color={theme.textSecondary} />
            <ThemedText
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              No upcoming bookings
            </ThemedText>
          </View>
        ) : (
          upcomingBookings.map((booking) => {
            const bookingId = booking._id || booking.id || "";
            const patientName =
              `${booking.patientId?.firstName} ${booking.patientId.lastName}` ||
              "Patient";
            const bookingType = booking?.type || "Consultation";
            const defaultAvatar =
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";

            return (
              <View
                key={bookingId}
                style={[
                  styles.bookingCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={styles.bookingInfo}>
                  <ThemedText style={styles.patientName}>
                    {patientName}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.bookingDetail,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {bookingType}: {booking.time}
                  </ThemedText>
                  <ThemedText
                    style={[styles.bookingDate, { color: theme.textSecondary }]}
                  >
                    {new Date(booking.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </ThemedText>
                  <Pressable
                    style={[
                      styles.viewDetailsButton,
                      { backgroundColor: theme.backgroundSecondary },
                    ]}
                    onPress={() => handleViewDetails(bookingId)}
                  >
                    <ThemedText style={styles.viewDetailsText}>
                      View Details
                    </ThemedText>
                    <Feather name='arrow-right' size={14} color={theme.text} />
                  </Pressable>
                </View>
                <Image
                  source={{ uri: defaultAvatar }}
                  style={styles.patientAvatar}
                />
              </View>
            );
          })
        )}
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
          <Feather name='calendar' size={20} color='#FFFFFF' />
          <ThemedText style={styles.primaryActionText}>
            Manage Availability
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.outlineActionButton, { borderColor: theme.success }]}
          onPress={handleUpdatePricing}
        >
          <Feather name='plus-square' size={20} color={theme.success} />
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  loadingText: {
    fontSize: Typography.sizes.md,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    marginTop: Spacing.md,
  },
  bookingDate: {
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing.sm,
  },
});
