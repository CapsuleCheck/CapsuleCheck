import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";

interface PrescriberLicenseUploadModalProps {
  visible: boolean;
  token: string | null;
  onUploadSuccess: () => void;
}

export function PrescriberLicenseUploadModal({
  visible,
  token,
  onUploadSuccess,
}: PrescriberLicenseUploadModalProps) {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("application/pdf");
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile(asset.name);
        setFileUri(asset.uri);
        setMimeType(asset.mimeType || "application/pdf");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select file. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileUri) {
      Toast.show({
        type: "error",
        text1: "No file selected",
        text2: "Please select your license document to upload.",
        position: "top",
      });
      return;
    }

    if (!token) {
      Toast.show({
        type: "error",
        text1: "Session expired",
        text2: "Please log in again.",
        position: "top",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append(
        "license",
        JSON.stringify({
          uri: fileUri,
          name: selectedFile,
          type: mimeType,
        }) as any,
      );

      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.prescriberUploadLicense}`,
        formData,
        {
          headers: {
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      Toast.show({
        type: "success",
        text1: "License uploaded",
        text2: "Your license has been submitted successfully.",
        position: "top",
      });
      onUploadSuccess();
    } catch (err) {
      console.error("Error uploading license:", err);
      let errorMessage = "Failed to upload license. Please try again.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: errorMessage,
        position: "top",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent={false}
      statusBarTranslucent
      onRequestClose={() => {
        /* Required on Android; intentionally no-op – modal cannot be dismissed */
      }}
    >
      <View
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
          bounces={false}
        >
          <View style={styles.iconWrapper}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Feather name='file-text' size={48} color={theme.primary} />
            </View>
          </View>
          <ThemedText style={styles.title}>Upload your license</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            You must upload your practicing license before you can use the app.
            This step is required and cannot be skipped.
          </ThemedText>
          <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
            Supported formats: PDF, JPG, PNG
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
              {selectedFile ? selectedFile : "Tap to select your license"}
            </ThemedText>
            <ThemedText
              style={[styles.uploadSubtitle, { color: theme.textSecondary }]}
            >
              {selectedFile ? "Tap to change file" : "Select a file"}
            </ThemedText>
          </Pressable>

          <PrimaryButton
            title={isUploading ? "Uploading…" : "Upload license"}
            onPress={handleUpload}
            disabled={!selectedFile || isUploading}
            loading={isUploading}
            style={styles.uploadButton}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing["2xl"],
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  hint: {
    fontSize: Typography.sizes.sm,
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  uploadArea: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    marginBottom: Spacing.xl,
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
  uploadButton: {
    marginTop: Spacing.md,
  },
});
