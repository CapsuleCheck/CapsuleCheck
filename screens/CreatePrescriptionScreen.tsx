import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useMedications, useAppointments } from "@/hooks/useAppDataHooks";
import { useAppData } from "@/context/AppDataContext";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { BookingsStackParamList } from "@/navigation/BookingsStackNavigator";
import { Medication, PrescriptionStatus } from "@/types/data";
import axios from "axios";
import { API_BASE_URL } from "@/constants/api";
import Toast from "react-native-toast-message";

type CreatePrescriptionRouteProp = RouteProp<
  BookingsStackParamList,
  "CreatePrescription"
>;
type NavigationProp = NativeStackNavigationProp<BookingsStackParamList>;

interface MedicationEntry {
  id: string;
  medication: Medication | null;
  dosage: string;
  frequency: string;
  quantity: string;
  totalRefills: string;
  showPicker: boolean;
}

export default function CreatePrescriptionScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const route = useRoute<CreatePrescriptionRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { bookingId, patientId, patientName } = route.params;

  const medications = useMedications();
  const appointments = useAppointments();
  const { createPrescription } = useAppData();

  const booking = appointments.getById(bookingId);

  const [medicationEntries, setMedicationEntries] = useState<MedicationEntry[]>(
    [
      {
        id: `med-entry-${Date.now()}`,
        medication: null,
        dosage: "",
        frequency: "",
        quantity: "",
        totalRefills: "",
        showPicker: false,
      },
    ]
  );
  const [expirationDate, setExpirationDate] = useState<Date>(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) {
    return (
      <ScreenKeyboardAwareScrollView>
        <View style={styles.container}>
          <ThemedText
            style={[styles.errorText, { color: theme.textSecondary }]}
          >
            Booking not found
          </ThemedText>
          <PrimaryButton
            title='Go Back'
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </ScreenKeyboardAwareScrollView>
    );
  }

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setExpirationDate(selectedDate);
    }
  };

  const addMedicationEntry = () => {
    setMedicationEntries([
      ...medicationEntries,
      {
        id: `med-entry-${Date.now()}`,
        medication: null,
        dosage: "",
        frequency: "",
        quantity: "",
        totalRefills: "",
        showPicker: false,
      },
    ]);
  };

  const removeMedicationEntry = (id: string) => {
    if (medicationEntries.length > 1) {
      setMedicationEntries(
        medicationEntries.filter((entry) => entry.id !== id)
      );
    }
  };

  const updateMedicationEntry = (
    id: string,
    updates: Partial<MedicationEntry>
  ) => {
    setMedicationEntries(
      medicationEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const isFormValid = medicationEntries.every(
    (entry) =>
      entry.medication &&
      entry.dosage.trim() &&
      entry.frequency.trim() &&
      entry.quantity.trim() &&
      !isNaN(Number(entry.quantity)) &&
      Number(entry.quantity) > 0 &&
      entry.totalRefills.trim() &&
      !isNaN(Number(entry.totalRefills)) &&
      Number(entry.totalRefills) >= 0
  );

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert(
        "Error",
        "Please fill in all required fields correctly for all medications."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const validEntries = medicationEntries.filter((e) => e.medication);
      const baseTimestamp = Date.now();

      // Create prescriptions for each medication
      const prescriptionPromises = validEntries.map(async (entry, index) => {
        if (!entry.medication) return null;

        const prescriptionData = {
          id: `rx-${baseTimestamp}-${index}`,
          medicationId: entry.medication.id,
          medication: entry.medication,
          prescriberId: booking.prescriberId,
          prescriberName: booking.prescriberName,
          dosage: entry.dosage.trim(),
          frequency: entry.frequency.trim(),
          quantity: Number(entry.quantity),
          refillsRemaining: Number(entry.totalRefills),
          totalRefills: Number(entry.totalRefills),
          status: "active" as PrescriptionStatus,
          dateIssued: new Date().toISOString().split("T")[0],
          expirationDate: formatDate(expirationDate),
          instructions: instructions.trim() || "",
          patientId,
        };

        // Save to backend
        try {
          await axios.post(`${API_BASE_URL}/prescriptions`, prescriptionData, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          // Show success message
          Toast.show({
            type: "success",
            text1: "Prescription Created!",
            text2: "Your patient will be notified of this prescription.",
            position: "top",
            visibilityTime: 3000,
          });
        } catch (apiError) {
          console.error(
            `API error for ${entry.medication.name} (continuing with local save):`,
            apiError
          );
          // Continue with local save even if API fails
        }

        // Save locally
        createPrescription(prescriptionData);

        return prescriptionData;
      });

      await Promise.all(prescriptionPromises);

      const medicationNames = validEntries
        .map((e) => e.medication?.name)
        .filter(Boolean)
        .join(", ");

      Alert.alert(
        "Success",
        `Prescription${validEntries.length > 1 ? "s" : ""} for ${medicationNames} ${validEntries.length > 1 ? "have" : "has"} been created successfully.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Error creating prescriptions:", error);
      Alert.alert("Error", "Failed to create prescriptions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMedicationEntry = (entry: MedicationEntry, index: number) => {
    return (
      <View
        key={entry.id}
        style={[
          styles.medicationCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.medicationHeader}>
          <ThemedText style={styles.medicationCardTitle}>
            Medication {index + 1}
          </ThemedText>
          {medicationEntries.length > 1 && (
            <Pressable
              onPress={() => removeMedicationEntry(entry.id)}
              style={styles.removeButton}
            >
              <Feather name='x' size={20} color={theme.error} />
            </Pressable>
          )}
        </View>

        {/* Medication Selection */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Medication *</ThemedText>
          <Pressable
            onPress={() =>
              updateMedicationEntry(entry.id, {
                showPicker: !entry.showPicker,
              })
            }
            style={[
              styles.selectInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText
              style={
                entry.medication
                  ? styles.selectText
                  : [styles.selectPlaceholder, { color: theme.textSecondary }]
              }
            >
              {entry.medication
                ? `${entry.medication.name}${entry.medication.dosage ? ` (${entry.medication.dosage})` : ""}`
                : "Select medication"}
            </ThemedText>
            <Feather
              name={entry.showPicker ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
          {entry.showPicker && (
            <View
              style={[
                styles.optionsList,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              {medications.all.map((med) => (
                <Pressable
                  key={med.id}
                  style={[
                    styles.optionItem,
                    entry.medication?.id === med.id && {
                      backgroundColor: theme.primary + "20",
                    },
                  ]}
                  onPress={() => {
                    updateMedicationEntry(entry.id, {
                      medication: med,
                      showPicker: false,
                      dosage:
                        med.dosage && !entry.dosage ? med.dosage : entry.dosage,
                    });
                  }}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      entry.medication?.id === med.id && {
                        color: theme.primary,
                      },
                    ]}
                  >
                    {med.name}
                    {med.dosage ? ` (${med.dosage})` : ""}
                  </ThemedText>
                  {entry.medication?.id === med.id ? (
                    <Feather name='check' size={18} color={theme.primary} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Dosage */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Dosage *</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder='e.g., 20mg, 500mg'
            placeholderTextColor={theme.textSecondary}
            value={entry.dosage}
            onChangeText={(text) =>
              updateMedicationEntry(entry.id, { dosage: text })
            }
          />
        </View>

        {/* Frequency */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Frequency *</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder='e.g., Once daily, Twice daily'
            placeholderTextColor={theme.textSecondary}
            value={entry.frequency}
            onChangeText={(text) =>
              updateMedicationEntry(entry.id, { frequency: text })
            }
          />
        </View>

        {/* Quantity */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Quantity *</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder='e.g., 30'
            placeholderTextColor={theme.textSecondary}
            value={entry.quantity}
            onChangeText={(text) =>
              updateMedicationEntry(entry.id, { quantity: text })
            }
            keyboardType='numeric'
          />
        </View>

        {/* Total Refills */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Total Refills *</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder='e.g., 3'
            placeholderTextColor={theme.textSecondary}
            value={entry.totalRefills}
            onChangeText={(text) =>
              updateMedicationEntry(entry.id, { totalRefills: text })
            }
            keyboardType='numeric'
          />
        </View>
      </View>
    );
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Create Prescription</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Patient: {patientName}
          </ThemedText>
        </View>

        {/* Medications List */}
        {medicationEntries.map((entry, index) =>
          renderMedicationEntry(entry, index)
        )}

        {/* Add Medication Button */}
        <Pressable
          onPress={addMedicationEntry}
          style={[
            styles.addButton,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <Feather name='plus' size={20} color={theme.primary} />
          <ThemedText style={[styles.addButtonText, { color: theme.primary }]}>
            Add Another Medication
          </ThemedText>
        </Pressable>

        {/* Shared Fields */}
        <View
          style={[
            styles.sharedFieldsCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.sharedFieldsTitle}>
            Shared Prescription Details
          </ThemedText>

          {/* Expiration Date */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Expiration Date *</ThemedText>
            {Platform.OS === "web" ? (
              <View style={styles.webDateInputContainer}>
                <input
                  type='date'
                  value={formatDate(expirationDate)}
                  min={formatDate(new Date())}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      const date = new Date(value);
                      if (!isNaN(date.getTime())) {
                        setExpirationDate(date);
                      }
                    }
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
            ) : (
              <>
                <Pressable
                  onPress={() => {
                    setShowDatePicker(Platform.OS === "ios");
                  }}
                  style={[
                    styles.selectInput,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <ThemedText style={styles.selectText}>
                    {formatDateForDisplay(expirationDate)}
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
                          value={expirationDate}
                          mode='date'
                          display='spinner'
                          onChange={handleDateChange}
                          minimumDate={new Date()}
                        />
                      </View>
                    )}
                    {Platform.OS === "android" && (
                      <DateTimePicker
                        value={expirationDate}
                        mode='date'
                        display='default'
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </View>

          {/* Instructions (Optional) */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>
              Instructions (Optional)
            </ThemedText>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder='e.g., Take with food in the evening'
              placeholderTextColor={theme.textSecondary}
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={4}
              textAlignVertical='top'
            />
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title={
              isSubmitting
                ? "Creating..."
                : `Create ${medicationEntries.length > 1 ? "Prescriptions" : "Prescription"}`
            }
            onPress={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </View>
    </ScreenKeyboardAwareScrollView>
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
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
  },
  medicationCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  medicationCardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
  },
  removeButton: {
    padding: Spacing.xs,
  },
  sharedFieldsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  sharedFieldsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
    position: "relative",
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  textInput: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: Typography.sizes.md,
  },
  textArea: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: Typography.sizes.md,
    minHeight: 100,
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  selectText: {
    fontSize: Typography.sizes.md,
    flex: 1,
  },
  selectPlaceholder: {
    fontSize: Typography.sizes.md,
    flex: 1,
  },
  optionsList: {
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    maxHeight: 200,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  optionText: {
    fontSize: Typography.sizes.md,
    flex: 1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  addButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  webDateInputContainer: {
    width: "100%",
  },
  datePickerContainer: {
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  datePickerButton: {
    padding: Spacing.xs,
  },
  datePickerButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  actions: {
    marginTop: Spacing.md,
  },
  submitButton: {
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
