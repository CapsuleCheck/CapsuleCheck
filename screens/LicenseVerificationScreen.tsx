import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LicenseVerificationScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { completeOnboarding } = useUser();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0].name);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select file. Please try again.");
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      completeOnboarding("prescriber");
    }, 1500);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingHorizontal: Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
      }}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Verify Your License</ThemedText>
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
        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View
            style={[
              styles.infoIcon,
              { backgroundColor: theme.secondary + "20" },
            ]}
          >
            <Feather name="file-text" size={24} color={theme.secondary} />
          </View>
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoTitle}>
              License Requirements
            </ThemedText>
            <ThemedText
              style={[styles.infoText, { color: theme.textSecondary }]}
            >
              Please upload a clear image of your practicing license. Ensure all
              four corners are visible and the text is legible.
            </ThemedText>
            <ThemedText
              style={[styles.infoFormats, { color: theme.textSecondary }]}
            >
              Supported formats: PDF, JPG, PNG.
            </ThemedText>
          </View>
        </View>

        <Pressable
          onPress={handleSelectFile}
          style={({ pressed }) => [
            styles.uploadArea,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Feather name="upload" size={32} color={theme.textSecondary} />
          <ThemedText style={styles.uploadTitle}>
            {selectedFile ? selectedFile : "Upload your license"}
          </ThemedText>
          <ThemedText
            style={[styles.uploadSubtitle, { color: theme.textSecondary }]}
          >
            Tap to select a file
          </ThemedText>
          {selectedFile ? null : (
            <PrimaryButton
              title="Select File"
              onPress={handleSelectFile}
              style={styles.selectButton}
            />
          )}
        </Pressable>

        <View
          style={[
            styles.securityNote,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Feather name="lock" size={16} color={theme.textSecondary} />
          <ThemedText
            style={[styles.securityText, { color: theme.textSecondary }]}
          >
            Your documents are encrypted and stored securely.
          </ThemedText>
        </View>

        <PrimaryButton
          title="Submit for Verification"
          onPress={handleSubmit}
          disabled={!selectedFile}
          loading={loading}
          style={styles.submitButton}
        />

        <Pressable
          onPress={() => completeOnboarding("prescriber")}
          testID="skip-verification"
        >
          <ThemedText style={[styles.skipText, { color: theme.primary }]}>
            Skip for Now
          </ThemedText>
        </Pressable>

        <Pressable>
          <ThemedText style={[styles.needHelp, { color: theme.textSecondary }]}>
            Need help?
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
  headerTitle: {
    fontSize: 18,
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
    fontSize: 12,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  infoCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing["3xl"],
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  infoContent: {},
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  infoFormats: {
    fontSize: 12,
  },
  uploadArea: {
    padding: Spacing["3xl"],
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  uploadSubtitle: {
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  selectButton: {
    paddingHorizontal: Spacing["3xl"],
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
  },
  submitButton: {
    marginBottom: Spacing.lg,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  needHelp: {
    fontSize: 14,
    textAlign: "center",
  },
});
