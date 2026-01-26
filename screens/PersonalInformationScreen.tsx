import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import axios, { isAxiosError } from "axios";
import Toast from "react-native-toast-message";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";

function toYYYYMMDD(value: string): string {
  if (!value || !String(value).trim()) return "";
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function PersonalInformationScreen() {
  const { theme } = useTheme();
  const { token, userData, updateUserData } = useUser();
  const profile = userData;

  console.log("profile", profile);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (profile) {
      // const addr =
      //   profile.address && typeof profile.address === "object"
      //     ? profile.address
      //     : {};
      setFormData({
        name:
          profile.name ??
          [profile.firstName, profile.lastName]
            .filter(Boolean)
            .join(" ")
            .trim(),
        email: profile.email ?? "",
        phone: profile.phone ?? profile.phoneNumber ?? "",
        dateOfBirth: toYYYYMMDD(profile.dateOfBirth ?? profile.dob ?? ""),
        street: profile.street ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        country: profile.country ?? "",
        zipCode: profile.zip ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const payload = {
      firstName: formData.name.split(" ")[0],
      lastName: formData.name.split(" ")[1],
      dob: toYYYYMMDD(formData.dateOfBirth),
      street: formData.street,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip: formData.zipCode,
      address: formData?.street ?? formData.address,
    };

    if (token) {
      setIsSaving(true);
      try {
        await axios.patch(
          `${API_BASE_URL}${API_ENDPOINTS.patientUpdate}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token.startsWith("Bearer ")
                ? token
                : `Bearer ${token}`,
            },
          },
        );
        updateUserData(payload);
        setIsEditing(false);
        Toast.show({
          type: "success",
          text1: "Profile updated",
          text2: "Your information has been saved.",
          position: "top",
        });
      } catch (err) {
        console.error("Error updating patient profile:", err);
        let errorMessage = "Failed to update profile. Please try again.";
        if (isAxiosError(err) && err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2: errorMessage,
          position: "top",
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      updateUserData(payload);
      setIsEditing(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    field: keyof typeof formData,
    icon: keyof typeof Feather.glyphMap,
    readOnly?: boolean,
  ) => (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabel}>
        <Feather name={icon} size={16} color={theme.textSecondary} />
        <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </ThemedText>
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        value={value}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        editable={isEditing && !readOnly}
        placeholderTextColor={theme.textSecondary}
      />
    </View>
  );

  if (!profile) {
    return (
      <ScreenKeyboardAwareScrollView>
        <View style={styles.content}>
          <ThemedText>Loading profile...</ThemedText>
        </View>
      </ScreenKeyboardAwareScrollView>
    );
  }

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Basic Information</ThemedText>
            {!isEditing && (
              <Pressable onPress={() => setIsEditing(true)}>
                <Feather name='edit-2' size={20} color={theme.primary} />
              </Pressable>
            )}
          </View>

          {renderInput("Full Name", formData.name, "name", "user")}
          {renderInput("Email", formData.email, "email", "mail", true)}
          {renderInput("Phone", formData.phone, "phone", "phone", true)}

          {/* Date of Birth: calendar picker when editing */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Feather name='calendar' size={16} color={theme.textSecondary} />
              <ThemedText
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Date of Birth
              </ThemedText>
            </View>
            {isEditing && Platform.OS === "web" ? (
              <View style={styles.webDateInputContainer}>
                <input
                  type='date'
                  value={formData.dateOfBirth}
                  max={toYYYYMMDD(new Date().toISOString())}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, dateOfBirth: value }));
                  }}
                  style={{
                    width: "100%",
                    padding: `${Spacing.md}px ${Spacing.lg}px`,
                    borderRadius: `${BorderRadius.lg}px`,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: theme.border,
                    backgroundColor: theme.backgroundSecondary,
                    color: theme.text,
                    fontSize: `${Typography.sizes.md}px`,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </View>
            ) : isEditing ? (
              <>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    styles.datePickerTouchable,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      { fontSize: Typography.sizes.md },
                      !formData.dateOfBirth && { color: theme.textSecondary },
                    ]}
                  >
                    {formData.dateOfBirth || "Tap to pick date"}
                  </ThemedText>
                  <Feather
                    name='calendar'
                    size={20}
                    color={theme.textSecondary}
                  />
                </Pressable>
                {showDatePicker && (
                  <>
                    {Platform.OS === "ios" && (
                      <View
                        style={[
                          styles.datePickerContainer,
                          {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <View style={styles.datePickerHeader}>
                          <Pressable
                            onPress={() => setShowDatePicker(false)}
                            style={styles.datePickerButton}
                          >
                            <ThemedText
                              style={[
                                styles.datePickerButtonText,
                                { color: theme.primary },
                              ]}
                            >
                              Cancel
                            </ThemedText>
                          </Pressable>
                          <ThemedText style={styles.datePickerTitle}>
                            Select Date
                          </ThemedText>
                          <Pressable
                            onPress={() => setShowDatePicker(false)}
                            style={styles.datePickerButton}
                          >
                            <ThemedText
                              style={[
                                styles.datePickerButtonText,
                                { color: theme.primary },
                              ]}
                            >
                              Done
                            </ThemedText>
                          </Pressable>
                        </View>
                        <DateTimePicker
                          value={
                            formData.dateOfBirth
                              ? new Date(formData.dateOfBirth + "T12:00:00")
                              : new Date()
                          }
                          mode='date'
                          display='spinner'
                          maximumDate={new Date()}
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(Platform.OS === "ios");
                            if (selectedDate) {
                              setFormData((prev) => ({
                                ...prev,
                                dateOfBirth: toYYYYMMDD(
                                  selectedDate.toISOString(),
                                ),
                              }));
                            }
                          }}
                          style={styles.datePicker}
                        />
                      </View>
                    )}
                    {Platform.OS === "android" && (
                      <DateTimePicker
                        value={
                          formData.dateOfBirth
                            ? new Date(formData.dateOfBirth + "T12:00:00")
                            : new Date()
                        }
                        mode='date'
                        display='default'
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setFormData((prev) => ({
                              ...prev,
                              dateOfBirth: toYYYYMMDD(
                                selectedDate.toISOString(),
                              ),
                            }));
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <View
                style={[
                  styles.input,
                  styles.readOnlyInput,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.border,
                  },
                ]}
              >
                <ThemedText style={{ fontSize: Typography.sizes.md }}>
                  {formData.dateOfBirth || "—"}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.cardTitle}>Address</ThemedText>

          {renderInput("Street Address", formData.street, "street", "map-pin")}
          {renderInput("City", formData.city, "city", "map")}
          {renderInput("State", formData.state, "state", "map")}
          {renderInput("Country", formData.country, "country", "map")}

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              {renderInput("ZIP Code", formData.zipCode, "zipCode", "map")}
            </View>
          </View>
        </View>

        {isEditing && (
          <View style={styles.actions}>
            <PrimaryButton
              title='Save Changes'
              onPress={handleSave}
              disabled={isSaving}
              loading={isSaving}
              style={styles.actionButton}
            />
            <PrimaryButton
              title='Cancel'
              onPress={() => setIsEditing(false)}
              variant='outline'
              style={styles.actionButton}
            />
          </View>
        )}
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  input: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.md,
    borderWidth: 1,
  },
  readOnlyInput: {
    justifyContent: "center",
  },
  webDateInputContainer: {
    width: "100%",
  },
  datePickerTouchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  datePickerContainer: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  datePickerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  datePickerButton: {
    padding: Spacing.xs,
  },
  datePickerButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  datePicker: {
    height: 200,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  actions: {
    gap: Spacing.md,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
});
