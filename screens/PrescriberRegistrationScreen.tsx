import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PrescriberRegistrationScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [consultationFee, setConsultationFee] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);

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

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0].name);
        setFileUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select file. Please try again.");
    }
  };

  const addSpecialty = () => {
    const trimmedSpecialty = specialty.trim();
    if (!trimmedSpecialty) {
      Toast.show({
        type: "error",
        text1: "Specialty Required",
        text2: "Please enter a specialty",
        position: "top",
      });
      return;
    }
    if (specialties.includes(trimmedSpecialty)) {
      Toast.show({
        type: "error",
        text1: "Duplicate Specialty",
        text2: "This specialty has already been added",
        position: "top",
      });
      return;
    }
    setSpecialties([...specialties, trimmedSpecialty]);
    setSpecialty("");
  };

  const removeSpecialty = (specialtyToRemove: string) => {
    setSpecialties(specialties.filter((s) => s !== specialtyToRemove));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Name Required",
        text2: "Please enter your name",
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

    // if (!title.trim()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Title Required",
    //     text2: "Please enter your professional title",
    //     position: "top",
    //   });
    //   return;
    // }

    // if (!bio.trim()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Bio Required",
    //     text2: "Please enter your professional bio",
    //     position: "top",
    //   });
    //   return;
    // }

    // if (!yearsExperience.trim()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Years of Experience Required",
    //     text2: "Please enter your years of experience",
    //     position: "top",
    //   });
    //   return;
    // }

    // const yearsExpNum = parseInt(yearsExperience.trim(), 10);
    // if (isNaN(yearsExpNum) || yearsExpNum < 0) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Invalid Years of Experience",
    //     text2: "Please enter a valid number",
    //     position: "top",
    //   });
    //   return;
    // }

    // if (specialties.length === 0) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Specialty Required",
    //     text2: "Please add at least one specialty",
    //     position: "top",
    //   });
    //   return;
    // }

    if (!selectedFile) {
      Toast.show({
        type: "error",
        text1: "License Required",
        text2: "Please upload your license details",
        position: "top",
      });
      return;
    }

    const formData = {
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      // title: title.trim(),
      // bio: bio.trim(),
      // yearsExperience: yearsExpNum,
      // specialty: specialties,
      availability: [],
      licenseFile: fileUri,
      licenseFileName: selectedFile,
      // consultationFee: consultationFee.trim()
      //   ? parseFloat(consultationFee.trim())
      //   : undefined,
    };

    navigation.navigate("PrescriberPassword", { formData });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingBottom: insets.bottom + Spacing.xl,
      }}
      keyboardShouldPersistTaps='handled'
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name='arrow-left' size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>
          Prescriber Registration
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
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
          Step 1 of 2
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.title}>Join the Network</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Fill in your details to get started
        </ThemedText>

        {/* Name */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Enter your full name'
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
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

        {/* Title */}
        {/* <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Professional Title</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='e.g., Dr., Nurse Practitioner, Physician Assistant'
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
            autoCapitalize='words'
          />
        </View> */}

        {/* Bio */}
        {/* <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Bio</ThemedText>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='Tell us about your professional background and expertise...'
            placeholderTextColor={theme.textSecondary}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical='top'
          />
        </View> */}

        {/* Years of Experience */}
        {/* <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Years of Experience</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='e.g., 5'
            placeholderTextColor={theme.textSecondary}
            value={yearsExperience}
            onChangeText={setYearsExperience}
            keyboardType='numeric'
          />
        </View> */}

        {/* Specialty */}
        {/* <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Specialty</ThemedText>
          <ThemedText style={[styles.hintText, { color: theme.textSecondary }]}>
            Add your areas of specialization
          </ThemedText>
          <View style={styles.specialtyInputRow}>
            <TextInput
              style={[
                styles.specialtyInput,
                {
                  backgroundColor: theme.backgroundSecondary,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder='e.g., Internal Medicine'
              placeholderTextColor={theme.textSecondary}
              value={specialty}
              onChangeText={setSpecialty}
              onSubmitEditing={addSpecialty}
              returnKeyType='done'
            />
            <Pressable
              onPress={addSpecialty}
              style={({ pressed }) => [
                styles.addSpecialtyButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Feather name='plus' size={20} color='#FFFFFF' />
            </Pressable>
          </View>

       
          {specialties.length > 0 && (
            <View style={styles.specialtiesList}>
              {specialties.map((spec, index) => (
                <View
                  key={index}
                  style={[
                    styles.specialtyChip,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <ThemedText style={styles.specialtyChipText}>
                    {spec}
                  </ThemedText>
                  <Pressable
                    onPress={() => removeSpecialty(spec)}
                    style={styles.removeSpecialtyButton}
                  >
                    <Feather name='x' size={16} color={theme.textSecondary} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View> */}

        {/* Consultation Fee */}
        {/* <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Consultation Fee</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder='200'
            placeholderTextColor={theme.textSecondary}
            value={consultationFee}
            onChangeText={setConsultationFee}
            keyboardType='numeric'
          />
        </View> */}

        {/* License Upload */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>License Details</ThemedText>
          <ThemedText style={[styles.hintText, { color: theme.textSecondary }]}>
            Upload your practicing license (PDF, JPG, or PNG)
          </ThemedText>
          <Pressable
            onPress={handleSelectFile}
            style={({ pressed }) => [
              styles.uploadArea,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: selectedFile ? theme.primary : theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather
              name={selectedFile ? "check-circle" : "upload"}
              size={32}
              color={selectedFile ? theme.primary : theme.textSecondary}
            />
            <ThemedText
              style={[
                styles.uploadTitle,
                selectedFile && { color: theme.primary },
              ]}
            >
              {selectedFile ? selectedFile : "Upload your license"}
            </ThemedText>
            <ThemedText
              style={[styles.uploadSubtitle, { color: theme.textSecondary }]}
            >
              {selectedFile ? "Tap to change file" : "Tap to select a file"}
            </ThemedText>
          </Pressable>
        </View>

        <PrimaryButton
          title='Continue'
          onPress={handleSubmit}
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
  textInput: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: Typography.sizes.md,
  },
  textArea: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: Typography.sizes.md,
    minHeight: 100,
  },
  specialtyInputRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  specialtyInput: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: Typography.sizes.md,
  },
  addSpecialtyButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  specialtiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  specialtyChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  specialtyChipText: {
    fontSize: Typography.sizes.sm,
    marginRight: Spacing.xs,
  },
  removeSpecialtyButton: {
    padding: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
  },
  hintText: {
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing.sm,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  pickerButtonText: {
    fontSize: Typography.sizes.md,
  },
  pickerOptions: {
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  pickerOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  pickerOptionText: {
    fontSize: Typography.sizes.md,
  },
  uploadArea: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  uploadTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  uploadSubtitle: {
    fontSize: Typography.sizes.sm,
  },
  continueButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
});
