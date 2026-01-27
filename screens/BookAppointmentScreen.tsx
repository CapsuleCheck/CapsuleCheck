import React, { useState, useMemo } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing } from "@/constants/theme";
import { usePrescribers } from "@/hooks/useAppDataHooks";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { useUser } from "@/context/UserContext";

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
];

export default function BookAppointmentScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const { userData, token } = useUser();
  const { prescriberId, prescriber } =
    (route.params as HomeStackParamList["BookAppointment"]) || {};

  const [selectedDate, setSelectedDate] = useState(10);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [isLoading, setIsLoading] = useState(false);

  // Get current month/year for display
  const currentDate = useMemo(() => {
    const date = new Date();
    return {
      month: date.toLocaleString("default", { month: "long" }),
      year: date.getFullYear(),
      currentMonth: date.getMonth(),
      currentYear: date.getFullYear(),
    };
  }, []);

  // Format selected date to YYYY-MM-DD format
  const formatSelectedDate = () => {
    const selectedDateObj = new Date(
      currentDate.currentYear,
      currentDate.currentMonth,
      selectedDate,
    );
    const year = selectedDateObj.getFullYear();
    const month = String(selectedDateObj.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Generate meeting link (you can customize this logic)
  const generateMeetingLink = () => {
    // For now, generate a simple meeting link
    // In production, you might want to integrate with Zoom, Google Meet, etc.
    const meetingId = `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return `https://meet.capsulecheck.com/${meetingId}`;
  };

  const handleConfirmAppointment = async () => {
    if (!prescriberId || !prescriber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Prescriber information is missing",
        position: "top",
      });
      return;
    }

    const patientId = userData?._id || userData?.id;
    if (!patientId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Patient information is missing. Please log in again.",
        position: "top",
      });
      return;
    }

    setIsLoading(true);

    try {
      const bookingDate = formatSelectedDate();
      const meetingLink = generateMeetingLink();

      const bookingData = {
        prescriberId: prescriberId,
        patientId: patientId,
        date: bookingDate,
        time: selectedTime,
        meetingLink: meetingLink,
      };

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.bookings}`,
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: token.startsWith("Bearer ")
                ? token
                : `Bearer ${token}`,
            }),
          },
        },
      );

      Toast.show({
        type: "success",
        text1: "Appointment Confirmed!",
        text2: "Your appointment has been successfully booked.",
        position: "top",
      });

      // Navigate back after successful booking
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (err) {
      console.error("Error creating booking:", err);
      let errorMessage = "Failed to book appointment. Please try again.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage =
            err.response.data?.message ||
            `Failed to book appointment: ${err.response.status}`;
        } else if (err.request) {
          errorMessage =
            "Unable to connect to server. Please check your connection.";
        }
      }

      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: errorMessage,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!prescriber) {
    return (
      <ScreenScrollView
        contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
      >
        <View style={styles.content}>
          <ThemedText style={styles.errorText}>Prescriber not found</ThemedText>
        </View>
      </ScreenScrollView>
    );
  }

  return (
    <ScreenScrollView
      contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
    >
      <View style={styles.content}>
        <View style={styles.pharmacistInfo}>
          <View
            style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
          >
            <Feather name='user' size={32} color={theme.primary} />
          </View>
          <View style={styles.pharmacistDetails}>
            <ThemedText style={styles.pharmacistName}>
              {prescriber.name} {prescriber.title}
            </ThemedText>
            <ThemedText
              style={[styles.pharmacistRole, { color: theme.textSecondary }]}
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
            {prescriber.bio && (
              <ThemedText style={[styles.bio, { color: theme.textSecondary }]}>
                {prescriber.bio || "-"}
              </ThemedText>
            )}
            {prescriber.consultationFee && (
              <ThemedText style={[styles.fee, { color: theme.primary }]}>
                Consultation Fee: ${prescriber.consultationFee}
              </ThemedText>
            )}
            {prescriber.yearsExperience > 0 && (
              <ThemedText
                style={[styles.experience, { color: theme.textSecondary }]}
              >
                {prescriber.yearsExperience} years of experience
              </ThemedText>
            )}
          </View>
        </View>

        <ThemedText style={styles.sectionTitle}>Select a Date</ThemedText>
        <View style={styles.calendarHeader}>
          <Pressable>
            <Feather name='chevron-left' size={24} color={theme.text} />
          </Pressable>
          <ThemedText style={styles.monthYear}>
            {currentDate.month} {currentDate.year}
          </ThemedText>
          <Pressable>
            <Feather name='chevron-right' size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.weekDays}>
          {DAYS_OF_WEEK.map((day) => (
            <ThemedText
              key={day}
              style={[styles.weekDay, { color: theme.textSecondary }]}
            >
              {day}
            </ThemedText>
          ))}
        </View>

        <View style={styles.datesGrid}>
          {[...Array(14)].map((_, i) => {
            const date = i + 6;
            const isSelected = date === selectedDate;
            return (
              <Pressable
                key={i}
                onPress={() => setSelectedDate(date)}
                style={({ pressed }) => [
                  styles.dateCell,
                  {
                    backgroundColor: isSelected ? theme.primary : "transparent",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.dateText,
                    { color: isSelected ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {date}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <ThemedText style={styles.sectionTitle}>
          Available Time Slots
        </ThemedText>
        <View style={styles.timeSlotsGrid}>
          {TIME_SLOTS.map((time) => {
            const isSelected = time === selectedTime;
            return (
              <Pressable
                key={time}
                onPress={() => setSelectedTime(time)}
                style={({ pressed }) => [
                  styles.timeSlot,
                  {
                    backgroundColor: isSelected
                      ? theme.primary + "20"
                      : theme.backgroundSecondary,
                    borderColor: isSelected ? theme.primary : theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.timeText,
                    { color: isSelected ? theme.primary : theme.text },
                  ]}
                >
                  {time}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <PrimaryButton
          title={isLoading ? "Booking..." : "Confirm Appointment"}
          onPress={handleConfirmAppointment}
          style={styles.confirmButton}
          disabled={isLoading}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='small' color={theme.primary} />
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
  pharmacistInfo: {
    flexDirection: "row",
    marginBottom: Spacing["3xl"],
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  pharmacistDetails: {
    flex: 1,
  },
  pharmacistName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  pharmacistRole: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviews: {
    fontSize: 14,
  },
  bio: {
    fontSize: 14,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  fee: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
  experience: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: Spacing["3xl"],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "600",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.md,
  },
  weekDay: {
    width: 40,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing["3xl"],
  },
  dateCell: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing["3xl"],
  },
  timeSlot: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  confirmButton: {
    marginBottom: Spacing.xl,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: Spacing.md,
  },
});
