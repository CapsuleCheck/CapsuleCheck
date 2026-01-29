import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
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

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function PatientOnboardingScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [gender, setGender] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showAllergyPicker, setShowAllergyPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.trim() && !validateEmail(text.trim())) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
    }
  };

  const isEmailValid = !email.trim() || validateEmail(email.trim());

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    isEmailValid &&
    phoneNumber.trim() &&
    dob !== null &&
    // address.trim() &&
    // city.trim() &&
    state.trim() &&
    // zip.trim() &&
    gender;

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const handleDateChange = (event: { type: string }, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleSubmit = () => {
    // Validate all required fields
    if (!firstName.trim()) {
      Toast.show({
        type: "error",
        text1: "First Name Required",
        text2: "Please enter your first name",
        position: "top",
      });
      return;
    }

    if (!lastName.trim()) {
      Toast.show({
        type: "error",
        text1: "Last Name Required",
        text2: "Please enter your last name",
        position: "top",
      });
      return;
    }

    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Email Required",
        text2: "Please enter your email address",
        position: "top",
      });
      return;
    }

    if (!validateEmail(email.trim())) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
        position: "top",
      });
      return;
    }

    if (!phoneNumber.trim()) {
      Toast.show({
        type: "error",
        text1: "Phone Number Required",
        text2: "Please enter your phone number",
        position: "top",
      });
      return;
    }

    if (!dob) {
      Toast.show({
        type: "error",
        text1: "Date of Birth Required",
        text2: "Please select your date of birth",
        position: "top",
      });
      return;
    }

    // if (!address.trim()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Address Required",
    //     text2: "Please enter your street address",
    //     position: "top",
    //   });
    //   return;
    // }

    // if (!city.trim()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "City Required",
    //     text2: "Please enter your city",
    //     position: "top",
    //   });
    //   return;
    // }

    // if (!state.trim()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "State Required",
    //     text2: "Please enter your state",
    //     position: "top",
    //   });
    //   return;
    // }

    if (!state.trim()) {
      Toast.show({
        type: "error",
        text1: "State Required",
        text2: "Please select your state",
        position: "top",
      });
      return;
    }

    // if (!zip.trim()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "ZIP Code Required",
    //     text2: "Please enter your ZIP code",
    //     position: "top",
    //   });
    //   return;
    // }

    if (!gender) {
      Toast.show({
        type: "error",
        text1: "Gender Required",
        text2: "Please select your gender",
        position: "top",
      });
      return;
    }

    // Filter out "None" from allergies array if present
    const allergiesArray = (allergies ?? []).filter(
      (allergy) => allergy !== "None",
    );

    const formData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      dateOfBirth: dob ? formatDate(dob) : "",
      address: {
        street: address.trim(),
        city: city.trim(),
        state: state.trim(),
        country: "USA",
        zip: zip.trim(),
      },
      gender: gender,
      allergies: allergiesArray,
    };

    // Navigate to step 3 (password screen) with form data
    navigation.navigate("PatientPassword", { formData });
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
                borderColor: emailError ? theme.error : theme.border,
              },
            ]}
            placeholder='Enter your email'
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
          {emailError && (
            <ThemedText style={[styles.errorText, { color: theme.error }]}>
              {emailError}
            </ThemedText>
          )}
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
          {Platform.OS === "web" ? (
            <View style={styles.webDateInputContainer}>
              <input
                type='date'
                value={dob ? formatDate(dob) : ""}
                max={formatDate(new Date())}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                      setDob(date);
                    }
                  } else {
                    setDob(null);
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
                  setShowDatePicker(true);
                  setShowGenderPicker(false);
                  setShowAllergyPicker(false);
                  setShowStatePicker(false);
                }}
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
                    dob
                      ? styles.selectText
                      : [
                          styles.selectPlaceholder,
                          { color: theme.textSecondary },
                        ]
                  }
                >
                  {dob
                    ? formatDateForDisplay(dob)
                    : "Select your date of birth"}
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
                        value={dob || new Date()}
                        mode='date'
                        display='spinner'
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        style={styles.datePicker}
                      />
                    </View>
                  )}
                  {Platform.OS === "android" && (
                    <DateTimePicker
                      value={dob || new Date()}
                      mode='date'
                      display='default'
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
            </>
          )}
        </View>

        {/* Address - commented out */}
        {/* <View style={styles.inputGroup}>
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
        </View> */}

        {/* City - commented out */}
        {/* <View style={styles.inputGroup}>
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
        </View> */}

        {/* State - commented out */}
        {/* <View style={styles.inputGroup}>
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
        </View> */}

        {/* State (USA) */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>State</ThemedText>
          <Pressable
            style={[
              styles.selectInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
            onPress={() => {
              setShowStatePicker(!showStatePicker);
              setShowGenderPicker(false);
              setShowAllergyPicker(false);
            }}
          >
            <ThemedText
              style={
                state
                  ? styles.selectText
                  : [styles.selectPlaceholder, { color: theme.textSecondary }]
              }
            >
              {state || "Select your state"}
            </ThemedText>
            <Feather
              name={showStatePicker ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>

          {showStatePicker ? (
            <View
              style={[
                styles.optionsList,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              {US_STATES.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.optionItem,
                    state === option && {
                      backgroundColor: theme.primary + "20",
                    },
                  ]}
                  onPress={() => {
                    setState(option);
                    setShowStatePicker(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      state === option && { color: theme.primary },
                    ]}
                  >
                    {option}
                  </ThemedText>
                  {state === option ? (
                    <Feather name='check' size={18} color={theme.primary} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {/* ZIP Code - commented out */}
        {/* <View style={styles.inputGroup}>
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
        </View> */}

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
              setShowStatePicker(false);
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

        {/* Allergies (Optional) - commented out */}
        {/* <View style={styles.inputGroup}>
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
              setShowStatePicker(false);
            }}
          >
            <ThemedText
              style={
                allergies.length > 0
                  ? styles.selectText
                  : [styles.selectPlaceholder, { color: theme.textSecondary }]
              }
            >
              {allergies.length > 0
                ? allergies.length === 1
                  ? allergies[0]
                  : `${allergies.length} selected`
                : "Select allergies"}
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
              {ALLERGY_OPTIONS.map((option) => {
                const isSelected = allergies.includes(option);
                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionItem,
                      isSelected && {
                        backgroundColor: theme.primary + "20",
                      },
                    ]}
                    onPress={() => {
                      if (option === "None") {
                        // If "None" is selected, clear all other selections
                        setAllergies(["None"]);
                      } else {
                        // Remove "None" if it's selected and add/remove the option
                        const newAllergies = allergies.filter(
                          (a) => a !== "None"
                        );
                        if (isSelected) {
                          // Remove the option if already selected
                          setAllergies(
                            newAllergies.filter((a) => a !== option)
                          );
                        } else {
                          // Add the option
                          setAllergies([...newAllergies, option]);
                        }
                      }
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        isSelected && { color: theme.primary },
                      ]}
                    >
                      {option}
                    </ThemedText>
                    {isSelected ? (
                      <Feather name='check' size={18} color={theme.primary} />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          {allergies.length > 0 && allergies[0] !== "None" && (
            <View style={styles.selectedAllergiesContainer}>
              {allergies.map((allergy) => (
                <View
                  key={allergy}
                  style={[
                    styles.allergyChip,
                    {
                      backgroundColor: theme.primary + "20",
                      borderColor: theme.primary,
                    },
                  ]}
                >
                  <ThemedText
                    style={[styles.allergyChipText, { color: theme.primary }]}
                  >
                    {allergy}
                  </ThemedText>
                  <Pressable
                    onPress={() => {
                      setAllergies(allergies.filter((a) => a !== allergy));
                    }}
                    style={styles.removeChipButton}
                  >
                    <Feather name='x' size={14} color={theme.primary} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View> */}

        <PrimaryButton
          title='Continue'
          onPress={handleSubmit}
          style={styles.continueButton}
        />

        {/* <Pressable onPress={handleSkip}>
          <ThemedText style={[styles.skipText, { color: theme.primary }]}>
            Skip for Now
          </ThemedText>
        </Pressable> */}
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
  webDateInputContainer: {
    width: "100%",
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
  },
  selectedAllergiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  allergyChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  allergyChipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500",
  },
  removeChipButton: {
    padding: Spacing.xxs,
  },
});
