import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing } from "@/constants/theme";

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
  const [selectedDate, setSelectedDate] = useState(10);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");

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
              Dr. Evelyn Reed
            </ThemedText>
            <ThemedText
              style={[styles.pharmacistRole, { color: theme.textSecondary }]}
            >
              Independent Prescriber
            </ThemedText>
            <View style={styles.ratingRow}>
              <Feather name="star" size={14} color="#F59E0B" />
              <ThemedText style={styles.rating}>4.8</ThemedText>
              <ThemedText
                style={[styles.reviews, { color: theme.textSecondary }]}
              >
                (214 reviews)
              </ThemedText>
            </View>
          </View>
        </View>

        <ThemedText style={styles.sectionTitle}>Select a Date</ThemedText>
        <View style={styles.calendarHeader}>
          <Pressable>
            <Feather name="chevron-left" size={24} color={theme.text} />
          </Pressable>
          <ThemedText style={styles.monthYear}>October 2024</ThemedText>
          <Pressable>
            <Feather name="chevron-right" size={24} color={theme.text} />
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
          title="Confirm Appointment"
          onPress={() => {}}
          style={styles.confirmButton}
        />
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
});
