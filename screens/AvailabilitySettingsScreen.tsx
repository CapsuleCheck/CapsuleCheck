import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useUser } from "@/context/UserContext";
import { usePrescriberProfile } from "@/hooks/useAppDataHooks";
import { useAppData } from "@/context/AppDataContext";
import {
  BorderRadius,
  Spacing,
  Typography,
} from "@/constants/theme";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

type AvailabilitySlot = {
  day: string;
  startTime: string;
  endTime: string;
};

function to24h(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parse24h(s: string): Date {
  const [h, m] = (s || "09:00").split(":").map(Number);
  const d = new Date();
  d.setHours(isNaN(h) ? 9 : h, isNaN(m) ? 0 : m, 0, 0);
  return d;
}

function format12h(s: string): string {
  const d = parse24h(s);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const DEFAULT_START = "09:00";
const DEFAULT_END = "17:00";

export default function AvailabilitySettingsScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const { token } = useUser();
  const prescriberProfile = usePrescriberProfile();
  const { updatePrescriberProfile } = useAppData();

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [pickingSlot, setPickingSlot] = useState<{
    day: string;
    index: number;
    field: "start" | "end";
  } | null>(null);
  const [tempTime, setTempTime] = useState<Date>(parse24h(DEFAULT_START));
  const [saving, setSaving] = useState(false);

  const normalized = useCallback((raw: { day: string; startTime: string; endTime: string }[]): AvailabilitySlot[] => {
    return (raw || []).map((s) => ({
      day: s.day || "",
      startTime: s.startTime || DEFAULT_START,
      endTime: s.endTime || DEFAULT_END,
    }));
  }, []);

  useEffect(() => {
    setSlots(normalized(prescriberProfile?.availability || []));
  }, [prescriberProfile?.availability, normalized]);

  const slotsByDay = DAYS.reduce<Record<string, AvailabilitySlot[]>>((acc, d) => {
    acc[d] = slots.filter((s) => s.day === d);
    return acc;
  }, {});

  const selectedDays = new Set(slots.map((s) => s.day));

  const toggleDay = (day: string) => {
    const has = selectedDays.has(day);
    if (has) {
      setSlots((prev) => prev.filter((s) => s.day !== day));
      if (expandedDay === day) setExpandedDay(null);
    } else {
      setSlots((prev) => [
        ...prev,
        { day, startTime: DEFAULT_START, endTime: DEFAULT_END },
      ]);
      setExpandedDay(day);
    }
  };

  const addSlot = (day: string) => {
    setSlots((prev) => [
      ...prev,
      { day, startTime: DEFAULT_START, endTime: DEFAULT_END },
    ]);
    setExpandedDay(day);
  };

  const globalIndexFor = (day: string, index: number): number => {
    let count = 0;
    const i = slots.findIndex((s) => {
      if (s.day !== day) return false;
      if (count === index) return true;
      count++;
      return false;
    });
    return i;
  };

  const removeSlot = (day: string, index: number) => {
    const i = globalIndexFor(day, index);
    if (i < 0) return;
    const daySlots = slots.filter((s) => s.day === day);
    const willRemoveLast = daySlots.length <= 1;
    setSlots((prev) => {
      const next = [...prev];
      next.splice(i, 1);
      return next;
    });
    if (willRemoveLast && expandedDay === day) setExpandedDay(null);
  };

  const updateSlot = (day: string, index: number, field: "startTime" | "endTime", value: string) => {
    const i = globalIndexFor(day, index);
    if (i < 0) return;
    setSlots((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const openTimePicker = (day: string, index: number, field: "start" | "end") => {
    const daySlots = slots.filter((s) => s.day === day);
    const slot = daySlots[index];
    if (!slot) return;
    const raw = field === "start" ? slot.startTime : slot.endTime;
    setTempTime(parse24h(raw));
    setPickingSlot({ day, index, field });
  };

  const onTimePickerChange = (_: any, date?: Date) => {
    if (!date || !pickingSlot) return;
    setTempTime(date);
    if (Platform.OS === "android") {
      const value = to24h(date);
      updateSlot(
        pickingSlot.day,
        pickingSlot.index,
        pickingSlot.field === "start" ? "startTime" : "endTime",
        value
      );
      setPickingSlot(null);
    }
  };

  const confirmTimePicker = () => {
    if (!pickingSlot) return;
    const value = to24h(tempTime);
    updateSlot(
      pickingSlot.day,
      pickingSlot.index,
      pickingSlot.field === "start" ? "startTime" : "endTime",
      value
    );
    setPickingSlot(null);
  };

  const applyPreset = (preset: "weekdays" | "weekends" | "all") => {
    const days =
      preset === "weekdays"
        ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        : preset === "weekends"
          ? ["Saturday", "Sunday"]
          : DAYS;
    const next: AvailabilitySlot[] = days.map((d) => ({
      day: d,
      startTime: DEFAULT_START,
      endTime: DEFAULT_END,
    }));
    setSlots(next);
    setExpandedDay(days[0] ?? null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { availability: slots };
      await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.prescriberUpdate}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
            }),
          },
        }
      );
      updatePrescriberProfile({ availability: slots });
      Toast.show({
        type: "success",
        text1: "Availability updated",
        text2: "Your schedule has been saved.",
        position: "top",
      });
    } catch (err) {
      console.error("Error saving availability:", err);
      let msg = "Failed to save availability.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: msg,
        position: "top",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderTimeInput = (
    day: string,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    if (Platform.OS === "web") {
      const [h, m] = (value || "09:00").split(":").map(Number);
      const valueForInput = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      return (
        <View style={styles.webTimeInputWrapper}>
          <input
            type="time"
            value={valueForInput}
            onChange={(e) => {
              const v = e.target.value;
              if (v)
                updateSlot(
                  day,
                  index,
                  field === "start" ? "startTime" : "endTime",
                  v
                );
            }}
            style={{
              width: "100%",
              padding: `${Spacing.sm}px ${Spacing.md}px`,
              borderRadius: BorderRadius.md,
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.backgroundSecondary,
              color: theme.text,
              fontSize: Typography.sizes.md,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </View>
      );
    }
    return (
      <Pressable
        onPress={() => openTimePicker(day, index, field)}
        style={[
          styles.timeChip,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <ThemedText style={styles.timeChipText}>{format12h(value)}</ThemedText>
        <Feather name="clock" size={14} color={theme.textSecondary} />
      </Pressable>
    );
  };

  return (
    <ScreenScrollView
      contentContainerStyle={{
        paddingBottom: screenInsets.paddingBottom + Spacing["3xl"],
        paddingHorizontal: Spacing.xl,
      }}
    >
      <View style={[styles.header, { paddingTop: screenInsets.paddingTop }]}>
        <ThemedText style={styles.title}>Availability</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose days and time slots when you're available for consultations.
        </ThemedText>
      </View>

      {/* Quick presets */}
      <View style={styles.presetsSection}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          Quick presets
        </ThemedText>
        <View style={styles.presetRow}>
          {(["weekdays", "weekends", "all"] as const).map((preset) => (
            <Pressable
              key={preset}
              onPress={() => applyPreset(preset)}
              style={({ pressed }) => [
                styles.presetChip,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <ThemedText style={[styles.presetChipText, { color: theme.text }]}>
                {preset === "weekdays"
                  ? "Weekdays"
                  : preset === "weekends"
                    ? "Weekends"
                    : "All week"}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Day selector */}
      <View style={styles.section}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          Select days
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayRow}
        >
          {DAYS.map((day) => {
            const selected = selectedDays.has(day);
            return (
              <Pressable
                key={day}
                onPress={() => toggleDay(day)}
                style={({ pressed }) => [
                  styles.dayChip,
                  {
                    backgroundColor: selected ? theme.primary : theme.backgroundSecondary,
                    borderColor: selected ? theme.primary : theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.dayChipText,
                    { color: selected ? "#fff" : theme.text },
                  ]}
                >
                  {DAY_SHORT[day] ?? day}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Slots by day */}
      <View style={styles.slotsSection}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          Time slots
        </ThemedText>
        {DAYS.filter((d) => selectedDays.has(d)).map((day) => {
          const daySlots = slotsByDay[day] || [];
          const isExpanded = expandedDay === day;
          return (
            <View
              key={day}
              style={[
                styles.dayCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Pressable
                onPress={() => setExpandedDay(isExpanded ? null : day)}
                style={({ pressed }) => [
                  styles.dayCardHeader,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.dayCardTitleRow}>
                  <Feather
                    name={isExpanded ? "chevron-down" : "chevron-right"}
                    size={18}
                    color={theme.textSecondary}
                  />
                  <ThemedText style={styles.dayCardTitle}>{day}</ThemedText>
                  <View
                    style={[
                      styles.slotCountBadge,
                      { backgroundColor: theme.primary + "20" },
                    ]}
                  >
                    <ThemedText style={[styles.slotCountText, { color: theme.primary }]}>
                      {daySlots.length} {daySlots.length === 1 ? "slot" : "slots"}
                    </ThemedText>
                  </View>
                </View>
              </Pressable>
              {isExpanded && (
                <View style={styles.dayCardBody}>
                  {daySlots.map((slot, idx) => (
                    <View
                      key={`${day}-${idx}`}
                      style={[
                        styles.slotRow,
                        {
                          backgroundColor: theme.backgroundSecondary,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View style={styles.slotTimes}>
                        {renderTimeInput(day, idx, "start", slot.startTime)}
                        <ThemedText style={[styles.slotDash, { color: theme.textSecondary }]}>
                          –
                        </ThemedText>
                        {renderTimeInput(day, idx, "end", slot.endTime)}
                      </View>
                      <Pressable
                        onPress={() => removeSlot(day, idx)}
                        hitSlop={8}
                        style={styles.removeSlotBtn}
                      >
                        <Feather name="trash-2" size={18} color={theme.error} />
                      </Pressable>
                    </View>
                  ))}
                  <Pressable
                    onPress={() => addSlot(day)}
                    style={({ pressed }) => [
                      styles.addSlotBtn,
                      {
                        borderColor: theme.primary,
                        borderStyle: "dashed",
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Feather name="plus" size={18} color={theme.primary} />
                    <ThemedText style={[styles.addSlotText, { color: theme.primary }]}>
                      Add time slot
                    </ThemedText>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
        {selectedDays.size === 0 && (
          <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
            Select at least one day above, then add time slots.
          </ThemedText>
        )}
      </View>

      {/* Time picker modal (iOS) */}
      {Platform.OS === "ios" && pickingSlot && (
        <View
          style={[
            styles.pickerOverlay,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.pickerHeader}>
            <Pressable onPress={() => setPickingSlot(null)}>
              <ThemedText style={[styles.pickerBtn, { color: theme.primary }]}>
                Cancel
              </ThemedText>
            </Pressable>
            <ThemedText style={styles.pickerTitle}>
              {pickingSlot?.field === "start" ? "Start time" : "End time"}
            </ThemedText>
            <Pressable onPress={confirmTimePicker}>
              <ThemedText style={[styles.pickerBtn, { color: theme.primary }]}>
                Done
              </ThemedText>
            </Pressable>
          </View>
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="spinner"
            onChange={onTimePickerChange}
          />
        </View>
      )}

      {/* Android time picker */}
      {Platform.OS === "android" && pickingSlot && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          display="default"
          onChange={onTimePickerChange}
        />
      )}

      <View style={styles.saveSection}>
        <PrimaryButton
          title={saving ? "Saving…" : "Save availability"}
          onPress={handleSave}
          disabled={saving}
        />
        {saving && (
          <ActivityIndicator
            size="small"
            color={theme.primary}
            style={styles.saveSpinner}
          />
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
  },
  presetsSection: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
    marginBottom: Spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  presetChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: Typography.sizes.md,
    fontWeight: "500",
  },
  dayRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  dayChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  dayChipText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  slotsSection: {
    marginBottom: Spacing.xl,
  },
  dayCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  dayCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  dayCardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dayCardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
  },
  slotCountBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  slotCountText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  dayCardBody: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  slotTimes: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 100,
  },
  timeChipText: {
    fontSize: Typography.sizes.md,
  },
  webTimeInputWrapper: {
    flex: 1,
    minWidth: 100,
  },
  slotDash: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  removeSlotBtn: {
    padding: Spacing.sm,
  },
  addSlotBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  addSlotText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  hint: {
    fontSize: Typography.sizes.md,
    fontStyle: "italic",
  },
  pickerOverlay: {
    position: "absolute",
    left: Spacing.xl,
    right: Spacing.xl,
    bottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  pickerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
  },
  pickerBtn: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  saveSection: {
    marginTop: Spacing.lg,
  },
  saveSpinner: {
    marginTop: Spacing.md,
  },
});
