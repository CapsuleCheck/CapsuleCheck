import React, { useState } from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function UploadPrescriptionScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access to take photos of your prescription."
        );
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      setLoading(false);

      if (!result.canceled && result.assets[0]) {
        navigation.navigate("PriceList");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const handleUploadDocument = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      setLoading(false);

      if (!result.canceled && result.assets[0]) {
        navigation.navigate("PriceList");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  };

  return (
    <ScreenScrollView contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}>
      <View style={styles.content}>
        <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
          Securely upload your prescription. We'll find you affordable alternatives. It's that simple.
        </ThemedText>

        <Pressable
          onPress={handleTakePhoto}
          disabled={loading}
          style={({ pressed }) => [
            styles.uploadButton,
            {
              backgroundColor: theme.primary,
              opacity: pressed || loading ? 0.7 : 1,
            },
          ]}
        >
          <Feather name="camera" size={32} color="#FFFFFF" />
          <ThemedText style={styles.uploadButtonText}>Take Photo</ThemedText>
        </Pressable>

        <Pressable
          onPress={handleUploadDocument}
          disabled={loading}
          style={({ pressed }) => [
            styles.uploadButton,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
              opacity: pressed || loading ? 0.7 : 1,
            },
          ]}
        >
          <Feather name="file-text" size={32} color={theme.text} />
          <ThemedText style={styles.uploadButtonTextDark}>Upload Document</ThemedText>
        </Pressable>

        <View style={[styles.tipsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.tipsHeader}>
            <Feather name="info" size={20} color={theme.success} />
            <ThemedText style={styles.tipsTitle}>Quick Tips for a Clear Upload</ThemedText>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <ThemedText style={styles.tipBullet}>•</ThemedText>
              <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
                Place prescription on a flat, well-lit surface.
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <ThemedText style={styles.tipBullet}>•</ThemedText>
              <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
                Ensure all text, including doctor's info, is clear and readable.
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <ThemedText style={styles.tipBullet}>•</ThemedText>
              <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
                Avoid shadows or glare on the document.
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <ThemedText style={styles.tipBullet}>•</ThemedText>
              <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
                Include the entire prescription in the frame.
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.privacy}>
          <Feather name="lock" size={16} color={theme.textSecondary} />
          <ThemedText style={[styles.privacyText, { color: theme.textSecondary }]}>
            Your privacy is protected. All data is encrypted and handled under strict HIPAA guidelines.
          </ThemedText>
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
    lineHeight: 24,
  },
  uploadButton: {
    height: 120,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: Spacing.sm,
  },
  uploadButtonTextDark: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Spacing.sm,
  },
  tipsCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing["3xl"],
    marginBottom: Spacing.xl,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  tipsList: {
    gap: Spacing.md,
  },
  tipItem: {
    flexDirection: "row",
  },
  tipBullet: {
    marginRight: Spacing.sm,
    fontSize: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  privacyText: {
    fontSize: 12,
    flex: 1,
    textAlign: "center",
  },
});

