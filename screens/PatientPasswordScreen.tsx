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
import {
  useNavigation,
  useRoute,
  RouteProp as RNRouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useAppData } from "@/context/AppDataContext";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = RNRouteProp<RootStackParamList, "PatientPassword">;

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  gender: string;
  allergies: string[];
}

export default function PatientPasswordScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { dispatch } = useAppData();

  const formData = route.params?.formData as PatientFormData | undefined;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Form data is missing. Please go back and try again.",
        position: "top",
      });
      return;
    }

    // Validate password
    if (!password.trim()) {
      Toast.show({
        type: "error",
        text1: "Password Required",
        text2: "Please enter a password",
        position: "top",
      });
      return;
    }

    if (password.trim().length < 8) {
      Toast.show({
        type: "error",
        text1: "Invalid Password",
        text2: "Password must be at least 8 characters",
        position: "top",
      });
      return;
    }

    if (!confirmPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Confirm Password Required",
        text2: "Please confirm your password",
        position: "top",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords Don't Match",
        text2: "Please make sure both passwords match",
        position: "top",
      });
      return;
    }

    setIsLoading(true);

    const patientData = {
      ...formData,
      password: password.trim(),
      ...formData.address,
      address: formData.address.street.trim(),
      dob: formData.dateOfBirth.trim(),
    };

    try {
      // Make API call to create patient
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.patients}`,
        patientData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state with the created patient data
      dispatch({
        type: "UPDATE_USER_PROFILE",
        payload: {
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.trim(),
          phone: formData.phoneNumber.trim(),
          dateOfBirth: formData.dateOfBirth.trim(),
          address: {
            street: formData.address.street.trim(),
            city: formData.address.city.trim(),
            state: formData.address.state.trim(),
            country: formData.address.country.trim(),
            zip: formData.address.zip.trim(),
          },
          allergies: formData.allergies,
        },
      });

      // Show success message
      Toast.show({
        type: "success",
        text1: "Account Created!",
        text2: "Your patient account has been successfully created.",
        position: "top",
        visibilityTime: 3000,
      });

      // Navigate to login screen instead of completing onboarding
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1500);
    } catch (err) {
      console.error("Error creating patient:", err);

      let errorMessage = "Failed to create patient. Please try again.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with error status
          errorMessage =
            err.response.data?.message ||
            `Server error: ${err.response.status}`;
        } else if (err.request) {
          // Request was made but no response received
          errorMessage =
            "Unable to connect to server. Please check your connection.";
        }
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
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
        <ThemedText style={styles.headerTitle}>Create Password</ThemedText>
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
            style={[styles.progressStep, { backgroundColor: theme.primary }]}
          />
        </View>
        <ThemedText
          style={[styles.progressText, { color: theme.textSecondary }]}
        >
          Step 3 of 3
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title}>Secure your account</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Create a strong password to protect your account
        </ThemedText>

        {/* Password */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Password</ThemedText>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.textInput,
                styles.passwordInput,
                {
                  backgroundColor: theme.backgroundSecondary,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder='Enter your password'
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
          <ThemedText style={[styles.hintText, { color: theme.textSecondary }]}>
            Must be at least 8 characters
          </ThemedText>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Confirm Password</ThemedText>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.textInput,
                styles.passwordInput,
                {
                  backgroundColor: theme.backgroundSecondary,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder='Confirm your password'
              placeholderTextColor={theme.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
          {confirmPassword &&
            password !== confirmPassword &&
            confirmPassword.length > 0 && (
              <ThemedText style={[styles.errorHint, { color: theme.error }]}>
                Passwords do not match
              </ThemedText>
            )}
        </View>

        <PrimaryButton
          title='Create Account'
          onPress={handleSubmit}
          disabled={isLoading}
          loading={isLoading}
          style={styles.continueButton}
        />
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
  passwordContainer: {
    position: "relative",
  },
  textInput: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: Typography.sizes.md,
  },
  passwordInput: {
    paddingRight: Spacing["3xl"],
  },
  eyeIcon: {
    position: "absolute",
    right: Spacing.md,
    top: "50%",
    transform: [{ translateY: -10 }],
    padding: Spacing.xs,
  },
  hintText: {
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
  },
  errorHint: {
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
  },
  continueButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
});
