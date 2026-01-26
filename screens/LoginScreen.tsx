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
import axios from "axios";
import Toast from "react-native-toast-message";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { useAppData } from "@/context/AppDataContext";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { API_BASE_URL } from "@/constants/api";
import { PrescriberProfile } from "@/types/data";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type LoginRole = "patient" | "prescriber";

export default function LoginScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { setPrescriberProfile } = useAppData();
  const { completeOnboarding } = useUser();

  const [selectedRole, setSelectedRole] = useState<LoginRole>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogin = async () => {
    // Validate email
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

    // Validate password
    if (!password.trim()) {
      Toast.show({
        type: "error",
        text1: "Password Required",
        text2: "Please enter your password",
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

    setIsLoading(true);

    try {
      // Make API call to login based on selected role
      const endpoint =
        selectedRole === "patient"
          ? `${API_BASE_URL}/patients/login`
          : `${API_BASE_URL}/prescribers/login`;

      const response = await axios.post(
        endpoint,
        {
          email: email.trim(),
          password: password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // Complete onboarding and navigate to main app (token stored in UserContext if present)
      completeOnboarding({
        ...response.data.data,
        selectedRole,
        token: response.data.token,
      });

      // Show success message
      Toast.show({
        type: "success",
        text1: "Login Successful!",
        text2: "Welcome back!",
        position: "top",
      });

      // Save prescriber profile if logging in as prescriber
      if (selectedRole === "prescriber" && response.data.data) {
        const prescriberData = response.data.data;
        const prescriberProfile: PrescriberProfile = {
          _id: prescriberData._id || prescriberData.id || "",
          name: prescriberData.name || "",
          email: prescriberData.email || "",
          phoneNumber: prescriberData.phoneNumber || prescriberData.phone || "",
          createdAt: prescriberData.createdAt || new Date().toISOString(),
          title: prescriberData.title || "",
          ratings: prescriberData.ratings || prescriberData.rating || 0,
          ratingsCount:
            prescriberData.ratingsCount || prescriberData.reviewCount || 0,
          verificationStatus: prescriberData.verificationStatus || false,
          availability: prescriberData.availability || [],
          bio: prescriberData.bio || "",
          yearsExperience: prescriberData.yearsExperience || 0,
          specialty: prescriberData.specialty || [],
          licenseFile: prescriberData.licenseFile || "",
          consultationFee: prescriberData.consultationFee || 0,
        };
        setPrescriberProfile(prescriberProfile);
      }
    } catch (err) {
      console.error("Error logging in:", err);

      let errorMessage = "Failed to login. Please check your credentials.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage =
            err.response.data?.message ||
            `Login failed: ${err.response.status}`;
        } else if (err.request) {
          errorMessage =
            "Unable to connect to server. Please check your connection.";
        }
      }

      Toast.show({
        type: "error",
        text1: "Login Failed",
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
        <ThemedText style={styles.headerTitle}>Login</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {/* Role Pills */}
      <View style={styles.rolePillsContainer}>
        <View
          style={[
            styles.rolePillsWrapper,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <Pressable
            onPress={() => setSelectedRole("patient")}
            style={[
              styles.rolePill,
              selectedRole === "patient" && {
                backgroundColor: theme.primary,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.rolePillText,
                selectedRole === "patient" && {
                  color: theme.buttonText,
                },
                selectedRole !== "patient" && {
                  color: theme.textSecondary,
                },
              ]}
            >
              Patient
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setSelectedRole("prescriber")}
            style={[
              styles.rolePill,
              selectedRole === "prescriber" && {
                backgroundColor: theme.primary,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.rolePillText,
                selectedRole === "prescriber" && {
                  color: theme.buttonText,
                },
                selectedRole !== "prescriber" && {
                  color: theme.textSecondary,
                },
              ]}
            >
              Prescriber
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title}>Welcome Back</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Sign in to your {selectedRole} account
        </ThemedText>

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
        </View>

        <PrimaryButton
          title='Login'
          onPress={handleLogin}
          disabled={isLoading}
          loading={isLoading}
          style={styles.loginButton}
        />

        <View style={styles.footer}>
          <ThemedText
            style={[styles.footerText, { color: theme.textSecondary }]}
          >
            Don&apos;t have an account?{" "}
          </ThemedText>
          <Pressable onPress={() => navigation.navigate("Onboarding")}>
            <ThemedText style={[styles.footerLink, { color: theme.primary }]}>
              Sign up
            </ThemedText>
          </Pressable>
        </View>
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
  textInput: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: Typography.sizes.md,
  },
  passwordContainer: {
    position: "relative",
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
  loginButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.sizes.md,
  },
  footerLink: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
  },
  rolePillsContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  rolePillsWrapper: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  rolePill: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  rolePillText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
  },
});
