import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useAppointments } from "@/hooks/useAppDataHooks";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { BookingsStackParamList } from "@/navigation/BookingsStackNavigator";

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
  const { bookingId } = route.params;

  const appointments = useAppointments();
  const booking = appointments.getById(bookingId);

  // For backwards compatibility, if booking is not found in appointments,
  // we'll handle it gracefully
  if (!booking) {
    return (
      <ScreenScrollView
        contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
      >
        <View style={styles.container}>
          <ThemedText style={[styles.errorText, { color: theme.textSecondary }]}>
            Booking not found
          </ThemedText>
          <PrimaryButton
            title="Go Back"
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
    navigation.navigate("CreatePrescription", {
      bookingId: booking.id,
      patientId: booking.patientId,
      patientName: booking.patientName,
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

  return (
    <ScreenScrollView
      contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.header,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.headerInfo}>
            <ThemedText style={styles.patientName}>
              {booking.patientName}
            </ThemedText>
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
                {getStatusText(booking.status)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>Appointment Details</ThemedText>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Feather name="calendar" size={16} color={theme.textSecondary} />
              <ThemedText
                style={[styles.detailLabel, { color: theme.textSecondary }]}
              >
                Date
              </ThemedText>
            </View>
            <ThemedText style={styles.detailValue}>
              {formatDate(booking.date)}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Feather name="clock" size={16} color={theme.textSecondary} />
              <ThemedText
                style={[styles.detailLabel, { color: theme.textSecondary }]}
              >
                Time
              </ThemedText>
            </View>
            <ThemedText style={styles.detailValue}>{booking.time}</ThemedText>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
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
                style={[styles.detailLabel, { color: theme.textSecondary }]}
              >
                Type
              </ThemedText>
            </View>
            <ThemedText style={styles.detailValue}>
              {getTypeText(booking.type)}
            </ThemedText>
          </View>

          {booking.address && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Feather name="map-pin" size={16} color={theme.textSecondary} />
                <ThemedText
                  style={[styles.detailLabel, { color: theme.textSecondary }]}
                >
                  Address
                </ThemedText>
              </View>
              <ThemedText style={[styles.detailValue, styles.addressText]}>
                {booking.address}
              </ThemedText>
            </View>
          )}

          {booking.meetingLink && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Feather name="link" size={16} color={theme.textSecondary} />
                <ThemedText
                  style={[styles.detailLabel, { color: theme.textSecondary }]}
                >
                  Meeting Link
                </ThemedText>
              </View>
              <ThemedText style={styles.detailValue}>{booking.meetingLink}</ThemedText>
            </View>
          )}

          {booking.reason && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Feather name="file-text" size={16} color={theme.textSecondary} />
                <ThemedText
                  style={[styles.detailLabel, { color: theme.textSecondary }]}
                >
                  Reason
                </ThemedText>
              </View>
              <ThemedText style={styles.detailValue}>{booking.reason}</ThemedText>
            </View>
          )}

          {booking.notes && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Feather name="edit-3" size={16} color={theme.textSecondary} />
                <ThemedText
                  style={[styles.detailLabel, { color: theme.textSecondary }]}
                >
                  Notes
                </ThemedText>
              </View>
              <ThemedText style={[styles.detailValue, styles.notesText]}>
                {booking.notes}
              </ThemedText>
            </View>
          )}
        </View>

        {booking.status === "scheduled" && (
          <View style={styles.actions}>
            <PrimaryButton
              title="CREATE PRESCRIPTION"
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
  header: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientName: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
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
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  detailLabel: {
    fontSize: Typography.sizes.sm,
  },
  detailValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  addressText: {
    maxWidth: "60%",
  },
  notesText: {
    maxWidth: "60%",
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
});
