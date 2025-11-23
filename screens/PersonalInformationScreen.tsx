import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

type PersonalInformationScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "PersonalInformation"
>;

export default function PersonalInformationScreen() {
  const navigation = useNavigation<PersonalInformationScreenNavigationProp>();
  const { theme } = useTheme();
  const { userRole } = useUser();

  const [formData, setFormData] = useState({
    firstName: userRole === "patient" ? "Mefe" : "Dr. Evelyn",
    lastName: userRole === "patient" ? "Johnson" : "Reed",
    email: userRole === "patient" ? "mefe.johnson@email.com" : "dr.reed@medpractice.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "01/15/1990",
    address: "123 Main Street, Apt 4B",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  const renderInput = (
    label: string,
    value: string,
    field: keyof typeof formData,
    icon: keyof typeof Feather.glyphMap
  ) => (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabel}>
        <Feather name={icon} size={16} color={theme.textSecondary} />
        <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </ThemedText>
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        value={value}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        editable={isEditing}
        placeholderTextColor={theme.textSecondary}
      />
    </View>
  );

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Basic Information</ThemedText>
            {!isEditing && (
              <Pressable onPress={() => setIsEditing(true)}>
                <Feather name="edit-2" size={20} color={theme.primary} />
              </Pressable>
            )}
          </View>

          {renderInput("First Name", formData.firstName, "firstName", "user")}
          {renderInput("Last Name", formData.lastName, "lastName", "user")}
          {renderInput("Email", formData.email, "email", "mail")}
          {renderInput("Phone", formData.phone, "phone", "phone")}
          {renderInput("Date of Birth", formData.dateOfBirth, "dateOfBirth", "calendar")}
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.cardTitle}>Address</ThemedText>
          
          {renderInput("Street Address", formData.address, "address", "map-pin")}
          {renderInput("City", formData.city, "city", "map")}
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              {renderInput("State", formData.state, "state", "map")}
            </View>
            <View style={styles.halfWidth}>
              {renderInput("ZIP Code", formData.zipCode, "zipCode", "map")}
            </View>
          </View>
        </View>

        {isEditing && (
          <View style={styles.actions}>
            <PrimaryButton
              title="Save Changes"
              onPress={handleSave}
              style={styles.actionButton}
            />
            <PrimaryButton
              title="Cancel"
              onPress={() => setIsEditing(false)}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        )}
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  input: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.md,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  actions: {
    gap: Spacing.md,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
});
