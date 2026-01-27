import React, { useState, useMemo } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios, { isAxiosError } from "axios";
import Toast from "react-native-toast-message";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { useUser } from "@/context/UserContext";

type AvailabilitySlot = {
  day: string;
  startTime: string;
  endTime: string;
};

const DAY_NAME_TO_WEEKDAY: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const WEEKDAY_TO_DAY_NAME: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function normalizeAvailability(prescriber: {
  availability?: AvailabilitySlot[];
  availableDays?: string[];
}): AvailabilitySlot[] {
  const av = prescriber?.availability;
  if (av && Array.isArray(av) && av.length > 0) {
    return av.map((s) => ({
      day: s.day || "",
      startTime: s.startTime || "09:00",
      endTime: s.endTime || "17:00",
    }));
  }
  const days = prescriber?.availableDays;
  if (days && Array.isArray(days) && days.length > 0) {
    return days.map((d) => ({
      day: typeof d === "string" ? d : "",
      startTime: "09:00",
      endTime: "17:00",
    }));
  }
  return [];
}

function getAvailableWeekdays(slots: AvailabilitySlot[]): number[] {
  const set = new Set<number>();
  for (const s of slots) {
    const w = DAY_NAME_TO_WEEKDAY[s.day];
    if (typeof w === "number") set.add(w);
  }
  return Array.from(set);
}

function getUpcomingAvailableDates(
  weekdays: number[],
  numWeeks: number = 6,
): { date: Date; yyyyMmDd: string; dayOfMonth: number; monthYear: string }[] {
  if (weekdays.length === 0) return [];
  const out: {
    date: Date;
    yyyyMmDd: string;
    dayOfMonth: number;
    monthYear: string;
  }[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + numWeeks * 7);
  const d = new Date(start);
  while (d <= end) {
    if (weekdays.includes(d.getDay())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      out.push({
        date: new Date(d),
        yyyyMmDd: `${y}-${m}-${day}`,
        dayOfMonth: d.getDate(),
        monthYear: d.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function parseTime24(s: string): { h: number; m: number } {
  const [h, m] = (s || "09:00").split(":").map(Number);
  return { h: isNaN(h) ? 9 : h, m: isNaN(m) ? 0 : m };
}

function timeToMinutes(h: number, m: number): number {
  return h * 60 + m;
}

function formatTime12h(h: number, m: number): string {
  const pm = h >= 12;
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const mm = String(m).padStart(2, "0");
  return `${h12}:${mm} ${pm ? "PM" : "AM"}`;
}

function getTimeSlotsForDay(
  slots: AvailabilitySlot[],
  dayName: string,
  intervalMinutes: number = 30,
): string[] {
  const daySlots = slots.filter(
    (s) => s.day.toLowerCase() === dayName.toLowerCase(),
  );
  if (daySlots.length === 0) return [];
  const seen = new Set<string>();
  const order: string[] = [];
  for (const s of daySlots) {
    const start = parseTime24(s.startTime);
    const end = parseTime24(s.endTime);
    let mins = timeToMinutes(start.h, start.m);
    const endMins = timeToMinutes(end.h, end.m);
    while (mins < endMins) {
      const h = Math.floor(mins / 60) % 24;
      const m = mins % 60;
      const str = formatTime12h(h, m);
      if (!seen.has(str)) {
        seen.add(str);
        order.push(str);
      }
      mins += intervalMinutes;
    }
  }
  return order;
}

export default function BookAppointmentScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const { userData, token } = useUser();
  const { prescriberId, prescriber } =
    (route.params as HomeStackParamList["BookAppointment"]) || {};

  const [selectedDateYyyyMmDd, setSelectedDateYyyyMmDd] = useState<
    string | null
  >(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const availability = useMemo(
    () => (prescriber ? normalizeAvailability(prescriber) : []),
    [prescriber],
  );
  const hasAvailability = availability.length > 0;

  const availableWeekdays = useMemo(
    () => getAvailableWeekdays(availability),
    [availability],
  );
  const upcomingDates = useMemo(
    () => getUpcomingAvailableDates(availableWeekdays, 6),
    [availableWeekdays],
  );

  const selectedDayName = useMemo(() => {
    if (!selectedDateYyyyMmDd) return null;
    const d = new Date(selectedDateYyyyMmDd + "T12:00:00");
    return WEEKDAY_TO_DAY_NAME[d.getDay()];
  }, [selectedDateYyyyMmDd]);

  const timeSlotsForSelectedDay = useMemo(() => {
    if (!selectedDayName) return [];
    return getTimeSlotsForDay(availability, selectedDayName, 30);
  }, [availability, selectedDayName]);

  const generateMeetingLink = () => {
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

    if (!hasAvailability || !selectedDateYyyyMmDd || !selectedTime) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a date and time.",
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
      const meetingLink = generateMeetingLink();

      const bookingData = {
        prescriberId: prescriberId,
        patientId: patientId,
        date: selectedDateYyyyMmDd,
        time: selectedTime,
        meetingLink: meetingLink,
      };

      await axios.post(
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

      if (isAxiosError(err)) {
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
            <Feather name="user" size={32} color={theme.primary} />
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
              <Feather name="star" size={14} color="#F59E0B" />
              <ThemedText style={styles.rating}>
                {(prescriber.ratings ?? 0).toFixed(1)}
              </ThemedText>
              <ThemedText
                style={[styles.reviews, { color: theme.textSecondary }]}
              >
                ({prescriber.ratingsCount ?? 0} reviews)
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
            {(prescriber.yearsExperience ?? 0) > 0 && (
              <ThemedText
                style={[styles.experience, { color: theme.textSecondary }]}
              >
                {prescriber.yearsExperience} years of experience
              </ThemedText>
            )}
          </View>
        </View>

        {!hasAvailability ? (
          <View
            style={[
              styles.noAvailabilityCard,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Feather name="calendar" size={40} color={theme.textSecondary} />
            <ThemedText
              style={[styles.noAvailabilityTitle, { color: theme.text }]}
            >
              No availability set
            </ThemedText>
            <ThemedText
              style={[
                styles.noAvailabilityText,
                { color: theme.textSecondary },
              ]}
            >
              This prescriber has not set their availability yet. Please check
              back later.
            </ThemedText>
          </View>
        ) : (
          <>
            <ThemedText style={styles.sectionTitle}>Select a date</ThemedText>
            <ThemedText
              style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
            >
              Dates shown are when this prescriber is available.
            </ThemedText>
            <View style={styles.datesGrid}>
              {upcomingDates.map((item) => {
                const isSelected = item.yyyyMmDd === selectedDateYyyyMmDd;
                return (
                  <Pressable
                    key={item.yyyyMmDd}
                    onPress={() => {
                      setSelectedDateYyyyMmDd(item.yyyyMmDd);
                      setSelectedTime(null);
                    }}
                    style={({ pressed }) => [
                      styles.dateCell,
                      {
                        backgroundColor: isSelected
                          ? theme.primary
                          : theme.backgroundSecondary,
                        borderColor: isSelected ? theme.primary : theme.border,
                        borderWidth: 1,
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
                      {item.dayOfMonth}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.dateSubtext,
                        {
                          color: isSelected
                            ? "rgba(255,255,255,0.9)"
                            : theme.textSecondary,
                        },
                      ]}
                    >
                      {item.monthYear}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            <ThemedText style={styles.sectionTitle}>
              Available time slots
            </ThemedText>
            {!selectedDateYyyyMmDd ? (
              <ThemedText
                style={[styles.hintText, { color: theme.textSecondary }]}
              >
                Select a date first to see available times.
              </ThemedText>
            ) : timeSlotsForSelectedDay.length === 0 ? (
              <ThemedText
                style={[styles.hintText, { color: theme.textSecondary }]}
              >
                No time slots for this day.
              </ThemedText>
            ) : (
              <View style={styles.timeSlotsGrid}>
                {timeSlotsForSelectedDay.map((time) => {
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
                          borderColor: isSelected
                            ? theme.primary
                            : theme.border,
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
            )}

            <PrimaryButton
              title={isLoading ? "Booking..." : "Confirm Appointment"}
              onPress={handleConfirmAppointment}
              style={styles.confirmButton}
              disabled={isLoading || !selectedDateYyyyMmDd || !selectedTime}
            />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            )}
          </>
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
  noAvailabilityCard: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  noAvailabilityTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  noAvailabilityText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  hintText: {
    fontSize: 14,
    marginBottom: Spacing.xl,
  },
  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing["3xl"],
  },
  dateCell: {
    minWidth: 56,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
  },
  dateSubtext: {
    fontSize: 11,
    marginTop: 2,
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
