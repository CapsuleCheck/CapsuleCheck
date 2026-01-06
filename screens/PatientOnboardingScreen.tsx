import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { useAppData } from "@/context/AppDataContext";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function PatientOnboardingScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { completeOnboarding } = useUser();
  const { dispatch } = useAppData();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const isFormValid = firstName.trim() && lastName.trim() && age.trim() && gender;

  const handleSubmit = () => {
    if (!isFormValid) return;

    dispatch({
      type: "UPDATE_USER_PROFILE",
      payload: {
        name: `${firstName.trim()} ${lastName.trim()}`,
        phone: phoneNumber.trim(),
      },
    });

    completeOnboarding("patient");
  };

  const handleSkip = () => {
    completeOnboarding("patient");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Your Details</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, { backgroundColor: theme.primary }]} />
          <View style={[styles.progressStep, { backgroundColor: theme.primary }]} />
          <View style={[styles.progressStep, { backgroundColor: theme.backgroundTertiary }]} />
        </View>
        <ThemedText style={[styles.progressText, { color: theme.textSecondary }]}>
          Step 2 of 3
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title}>Tell us about yourself</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          This helps us personalize your experience
        </ThemedText>

        {/* First Name */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>First Name</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Enter your first name"
            placeholderTextColor={theme.textSecondary}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Last Name</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Enter your last name"
            placeholderTextColor={theme.textSecondary}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Age</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Enter your age"
            placeholderTextColor={theme.textSecondary}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>

        {/* Gender */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Gender</ThemedText>
          <Pressable
            style={[
              styles.selectInput,
              { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
            ]}
            onPress={() => setShowGenderPicker(!showGenderPicker)}
          >
            <ThemedText style={gender ? styles.selectText : [styles.selectPlaceholder, { color: theme.textSecondary }]}>
              {gender || "Select your gender"}
            </ThemedText>
            <Feather name={showGenderPicker ? "chevron-up" : "chevron-down"} size={20} color={theme.textSecondary} />
          </Pressable>

          {showGenderPicker ? (
            <View style={[styles.optionsList, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {GENDER_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.optionItem,
                    gender === option && { backgroundColor: theme.primary + "20" },
                  ]}
                  onPress={() => {
                    setGender(option);
                    setShowGenderPicker(false);
                  }}
                >
                  <ThemedText style={[styles.optionText, gender === option && { color: theme.primary }]}>
                    {option}
                  </ThemedText>
                  {gender === option ? (
                    <Feather name="check" size={18} color={theme.primary} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {/* Phone Number (Optional) */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>
            Phone Number <ThemedText style={[styles.optionalLabel, { color: theme.textSecondary }]}>(Optional)</ThemedText>
          </ThemedText>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Enter your phone number"
            placeholderTextColor={theme.textSecondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <PrimaryButton
          title="Continue"
          onPress={handleSubmit}
          disabled={!isFormValid}
          style={styles.continueButton}
        />

        <Pressable onPress={handleSkip}>
          <ThemedText style={[styles.skipText, { color: theme.primary }]}>
            Skip for Now
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
  },
  progressContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing["3xl"],
  },
  progressBar: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: BorderRadius.xs,
  },
  progressText: {
    fontSize: Typography.sizes.xs,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    marginBottom: Spacing["2xl"],
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  optionalLabel: {
    fontWeight: "400",
  },
  textInput: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: Typography.sizes.md,
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  selectText: {
    fontSize: Typography.sizes.md,
  },
  selectPlaceholder: {
    fontSize: Typography.sizes.md,
  },
  optionsList: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  optionText: {
    fontSize: Typography.sizes.md,
  },
  continueButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  skipText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    textAlign: "center",
  },
});
