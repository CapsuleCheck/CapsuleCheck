import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
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
const ALLERGY_OPTIONS = [
  "None",
  "Penicillin",
  "Peanuts",
  "Shellfish",
  "Latex",
  "Iodine",
  "Aspirin",
  "Sulfa",
  "Dairy",
  "Eggs",
  "Other",
];

export default function PatientOnboardingScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { completeOnboarding } = useUser();
  const { dispatch } = useAppData();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [gender, setGender] = useState("");
  const [allergies, setAllergies] = useState("");
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showAllergyPicker, setShowAllergyPicker] = useState(false);

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    phoneNumber.trim() &&
    dob.trim() &&
    address.trim() &&
    city.trim() &&
    state.trim() &&
    country.trim() &&
    zip.trim() &&
    gender;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const allergiesArray = allergies && allergies !== "None" ? [allergies] : [];

    dispatch({
      type: "UPDATE_USER_PROFILE",
      payload: {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phoneNumber.trim(),
        dateOfBirth: dob.trim(),
        address: {
          street: address.trim(),
          city: city.trim(),
          state: state.trim(),
          country: country.trim(),
          zip: zip.trim(),
        },
        allergies: allergiesArray,
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
      keyboardShouldPersistTaps='handled'
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name='arrow-left' size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Your Details</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressStep, { backgroundColor: theme.primary }]}
          />
          <View
            style={[styles.progressStep, { backgroundColor: theme.primary }]}
          />
          <View
            style={[
              styles.progressStep,
              { backgroundColor: theme.backgroundTertiary },
            ]}
          />
        </View>
        <ThemedText
          style={[styles.progressText, { color: theme.textSecondary }]}
        >
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
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your first name'
            placeholderTextColor={theme.textSecondary}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize='words'
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Last Name</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your last name'
            placeholderTextColor={theme.textSecondary}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize='words'
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Email</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your email'
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Phone Number</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your phone number'
            placeholderTextColor={theme.textSecondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType='phone-pad'
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Date of Birth</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='YYYY-MM-DD'
            placeholderTextColor={theme.textSecondary}
            value={dob}
            onChangeText={setDob}
            keyboardType='numeric'
          />
        </View>

        {/* Address */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Address</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your street address'
            placeholderTextColor={theme.textSecondary}
            value={address}
            onChangeText={setAddress}
            autoCapitalize='words'
          />
        </View>

        {/* City */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>City</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your city'
            placeholderTextColor={theme.textSecondary}
            value={city}
            onChangeText={setCity}
            autoCapitalize='words'
          />
        </View>

        {/* State */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>State</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your state'
            placeholderTextColor={theme.textSecondary}
            value={state}
            onChangeText={setState}
            autoCapitalize='words'
          />
        </View>

        {/* Country */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Country</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your country'
            placeholderTextColor={theme.textSecondary}
            value={country}
            onChangeText={setCountry}
            autoCapitalize='words'
          />
        </View>

        {/* ZIP Code */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>ZIP Code</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your ZIP code'
            placeholderTextColor={theme.textSecondary}
            value={zip}
            onChangeText={setZip}
            keyboardType='numeric'
          />
        </View>

        {/* Gender */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Gender</ThemedText>
          <Pressable
            style={[
              styles.selectInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
            onPress={() => {
              setShowGenderPicker(!showGenderPicker);
              setShowAllergyPicker(false);
            }}
          >
            <ThemedText
              style={
                gender
                  ? styles.selectText
                  : [styles.selectPlaceholder, { color: theme.textSecondary }]
              }
            >
              {gender || "Select your gender"}
            </ThemedText>
            <Feather
              name={showGenderPicker ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>

          {showGenderPicker ? (
            <View
              style={[
                styles.optionsList,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              {GENDER_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.optionItem,
                    gender === option && {
                      backgroundColor: theme.primary + "20",
                    },
                  ]}
                  onPress={() => {
                    setGender(option);
                    setShowGenderPicker(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      gender === option && { color: theme.primary },
                    ]}
                  >
                    {option}
                  </ThemedText>
                  {gender === option ? (
                    <Feather name='check' size={18} color={theme.primary} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {/* Allergies (Optional) */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>
            Allergies{" "}
            <ThemedText
              style={[styles.optionalLabel, { color: theme.textSecondary }]}
            >
              (Optional)
            </ThemedText>
          </ThemedText>
          <Pressable
            style={[
              styles.selectInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
            onPress={() => {
              setShowAllergyPicker(!showAllergyPicker);
              setShowGenderPicker(false);
            }}
          >
            <ThemedText
              style={
                allergies
                  ? styles.selectText
                  : [styles.selectPlaceholder, { color: theme.textSecondary }]
              }
            >
              {allergies || "Select allergies"}
            </ThemedText>
            <Feather
              name={showAllergyPicker ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>

          {showAllergyPicker ? (
            <View
              style={[
                styles.optionsList,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              {ALLERGY_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.optionItem,
                    allergies === option && {
                      backgroundColor: theme.primary + "20",
                    },
                  ]}
                  onPress={() => {
                    setAllergies(option);
                    setShowAllergyPicker(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      allergies === option && { color: theme.primary },
                    ]}
                  >
                    {option}
                  </ThemedText>
                  {allergies === option ? (
                    <Feather name='check' size={18} color={theme.primary} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <PrimaryButton
          title='Continue'
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
