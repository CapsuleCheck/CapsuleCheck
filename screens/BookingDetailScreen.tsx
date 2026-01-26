import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { BookingsStackParamList } from "@/navigation/BookingsStackNavigator";
import { API_BASE_URL } from "@/constants/api";
import { useUser } from "@/context/UserContext";

interface BookingDetail {
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

type BookingDetailRouteProp = RouteProp<
  BookingsStackParamList,
  "BookingDetails"
>;
type NavigationProp = NativeStackNavigationProp<BookingsStackParamList>;

export default function BookingDetailScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const route = useRoute<BookingDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { token } = useUser();
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && {
            Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
          }),
        },
        params: {
          _id: bookingId,
        },
      });

      // Handle different response formats
      let bookingData: BookingDetail | null = response.data.bookings[0];

      if (bookingData) {
        // Extract patient name if patientId is an object
        if (
          typeof bookingData.patientId === "object" &&
          bookingData.patientId !== null &&
          !bookingData.patientName
        ) {
          const patient = bookingData.patientId as {
            firstName?: string;
            lastName?: string;
          };
          bookingData.patientName =
            `${patient.firstName || ""} ${patient.lastName || ""}`.trim() ||
            "Patient";
        }
        setBooking(bookingData);
      } else {
        setError("Booking not found");
      }
    } catch (err) {
      console.error("Error fetching booking details:", err);
      let errorMessage = "Failed to load booking details.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage =
            err.response.data?.message ||
            `Failed to load booking: ${err.response.status}`;
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

  if (isLoading) {
    return (
      <ScreenScrollView
        contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
      >
        <View style={styles.container}>
          <ActivityIndicator size='large' color={theme.primary} />
          <ThemedText
            style={[styles.loadingText, { color: theme.textSecondary }]}
          >
            Loading booking details...
          </ThemedText>
        </View>
      </ScreenScrollView>
    );
  }

  if (error || !booking) {
    return (
      <ScreenScrollView
        contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
      >
        <View style={styles.container}>
          <ThemedText
            style={[styles.errorText, { color: theme.textSecondary }]}
          >
            {error || "Booking not found"}
          </ThemedText>
          <PrimaryButton
            title='Go Back'
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </ScreenScrollView>
    );
  }

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Scheduled";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "no_show":
        return "No Show";
      default:
        return status;
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

  const handleCreatePrescription = () => {
    const bookingIdValue = booking._id || booking.id || "";
    const patientIdValue =
      typeof booking.patientId === "string"
        ? booking.patientId
        : (booking.patientId as { _id?: string })?._id || "";
    const patientNameValue = booking.patientName || "Patient";

    navigation.navigate("CreatePrescription", {
      bookingId: bookingIdValue,
      patientId: patientIdValue,
      patientName: patientNameValue,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleOpenMeetingLink = () => {
    if (booking?.meetingLink) {
      Linking.openURL(booking.meetingLink);
    }
  };

  return (
    <ScreenScrollView
      contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
    >
      <View style={styles.content}>
        {/* Patient Header Card */}
        <View
          style={[
            styles.patientCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.patientAvatarContainer}>
            <View
              style={[
                styles.patientAvatar,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Feather name='user' size={32} color={theme.primary} />
            </View>
          </View>
          <View style={styles.patientInfo}>
            <ThemedText style={styles.patientName}>
              {booking.patientName || "Patient"}
            </ThemedText>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(booking.status || "") + "20",
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(booking.status || "") },
                ]}
              />
              <ThemedText
                style={[
                  styles.statusText,
                  { color: getStatusColor(booking.status || "") },
                ]}
              >
                {getStatusText(booking.status || "")}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Date & Time Highlight Card */}
        <View
          style={[
            styles.datetimeCard,
            {
              backgroundColor: theme.primary + "10",
              borderColor: theme.primary + "30",
            },
          ]}
        >
          <View style={styles.datetimeContent}>
            <View style={styles.dateSection}>
              <Feather name='calendar' size={24} color={theme.primary} />
              <View style={styles.dateTextContainer}>
                <ThemedText
                  style={[styles.dateLabel, { color: theme.textSecondary }]}
                >
                  Date
                </ThemedText>
                <ThemedText style={[styles.dateValue, { color: theme.text }]}>
                  {formatShortDate(booking.date)}
                </ThemedText>
                <ThemedText
                  style={[styles.dateFull, { color: theme.textSecondary }]}
                >
                  {formatDate(booking.date)}
                </ThemedText>
              </View>
            </View>
            <View style={styles.timeSection}>
              <Feather name='clock' size={24} color={theme.primary} />
              <View style={styles.timeTextContainer}>
                <ThemedText
                  style={[styles.timeLabel, { color: theme.textSecondary }]}
                >
                  Time
                </ThemedText>
                <ThemedText style={[styles.timeValue, { color: theme.text }]}>
                  {booking.time}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Appointment Type Card */}
        <View
          style={[
            styles.typeCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.typeIconContainer}>
            <View
              style={[
                styles.typeIcon,
                {
                  backgroundColor:
                    booking.type === "video_call"
                      ? theme.primary + "20"
                      : booking.type === "in_person"
                        ? theme.success + "20"
                        : theme.warning + "20",
                },
              ]}
            >
              <Feather
                name={
                  booking.type === "video_call"
                    ? "video"
                    : booking.type === "in_person"
                      ? "map-pin"
                      : "phone"
                }
                size={20}
                color={
                  booking.type === "video_call"
                    ? theme.primary
                    : booking.type === "in_person"
                      ? theme.success
                      : theme.warning
                }
              />
            </View>
            <View style={styles.typeInfo}>
              <ThemedText
                style={[styles.typeLabel, { color: theme.textSecondary }]}
              >
                Appointment Type
              </ThemedText>
              <ThemedText style={[styles.typeValue, { color: theme.text }]}>
                {getTypeText(booking.type || "")}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Meeting Link Card (if available) */}
        {booking.meetingLink && (
          <Pressable
            onPress={handleOpenMeetingLink}
            style={({ pressed }) => [
              styles.meetingLinkCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.meetingLinkContent}>
              <View
                style={[
                  styles.meetingIcon,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Feather name='video' size={20} color={theme.primary} />
              </View>
              <View style={styles.meetingLinkInfo}>
                <ThemedText
                  style={[
                    styles.meetingLinkLabel,
                    { color: theme.textSecondary },
                  ]}
                >
                  Meeting Link
                </ThemedText>
                <ThemedText
                  style={[styles.meetingLinkValue, { color: theme.primary }]}
                  numberOfLines={1}
                >
                  {booking.meetingLink}
                </ThemedText>
              </View>
              <Feather name='external-link' size={18} color={theme.primary} />
            </View>
          </Pressable>
        )}

        {/* Address Card (if available) */}
        {booking.address && (
          <View
            style={[
              styles.infoCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.infoHeader}>
              <Feather name='map-pin' size={18} color={theme.primary} />
              <ThemedText style={[styles.infoTitle, { color: theme.text }]}>
                Address
              </ThemedText>
            </View>
            <ThemedText
              style={[styles.infoValue, { color: theme.textSecondary }]}
            >
              {booking.address}
            </ThemedText>
          </View>
        )}

        {/* Reason Card (if available) */}
        {booking.reason && (
          <View
            style={[
              styles.infoCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.infoHeader}>
              <Feather name='file-text' size={18} color={theme.primary} />
              <ThemedText style={[styles.infoTitle, { color: theme.text }]}>
                Reason for Visit
              </ThemedText>
            </View>
            <ThemedText
              style={[styles.infoValue, { color: theme.textSecondary }]}
            >
              {booking.reason}
            </ThemedText>
          </View>
        )}

        {/* Notes Card (if available) */}
        {booking.notes && (
          <View
            style={[
              styles.infoCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.infoHeader}>
              <Feather name='edit-3' size={18} color={theme.primary} />
              <ThemedText style={[styles.infoTitle, { color: theme.text }]}>
                Notes
              </ThemedText>
            </View>
            <ThemedText
              style={[styles.infoValue, { color: theme.textSecondary }]}
            >
              {booking.notes}
            </ThemedText>
          </View>
        )}

        {/* Action Button */}
        {(booking.status === "scheduled" || booking.status === "pending") && (
          <View style={styles.actions}>
            <PrimaryButton
              title='CREATE PRESCRIPTION'
              onPress={handleCreatePrescription}
              style={styles.createButton}
            />
          </View>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  content: {
    padding: Spacing.xl,
  },
  patientCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    marginBottom: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  patientAvatarContainer: {
    marginRight: Spacing.lg,
  },
  patientAvatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: "600",
  },
  datetimeCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  datetimeContent: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing.xs,
  },
  dateValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  dateFull: {
    fontSize: Typography.sizes.sm,
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
    paddingLeft: Spacing.lg,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.1)",
  },
  timeTextContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing.xs,
  },
  timeValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
  },
  typeCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  typeIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing.xs,
  },
  typeValue: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  meetingLinkCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  meetingLinkContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  meetingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  meetingLinkInfo: {
    flex: 1,
  },
  meetingLinkLabel: {
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing.xs,
  },
  meetingLinkValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500",
  },
  infoCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
  actions: {
    marginTop: Spacing.md,
  },
  createButton: {
    width: "100%",
  },
  errorText: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  backButton: {
    marginTop: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.sizes.md,
    marginTop: Spacing.md,
    textAlign: "center",
  },
});
