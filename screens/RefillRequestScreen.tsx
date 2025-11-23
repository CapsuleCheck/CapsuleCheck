import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { usePrescriptions } from "@/hooks/useAppDataHooks";
import { useAppData } from "@/context/AppDataContext";
import { BorderRadius, Spacing } from "@/constants/theme";
import { MyRxStackParamList } from "@/navigation/MyRxStackNavigator";

type RefillRequestRouteProp = RouteProp<MyRxStackParamList, "RefillRequest">;
type NavigationProp = NativeStackNavigationProp<MyRxStackParamList>;

export default function RefillRequestScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const route = useRoute<RefillRequestRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { prescriptionId } = route.params;
  
  const prescriptions = usePrescriptions();
  const { createRefillRequest, updatePrescription, createNotification } = useAppData();
  
  const prescription = prescriptions.getById(prescriptionId);
  const [selectedPharmacy, setSelectedPharmacy] = useState("CVS Pharmacy");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!prescription) {
    return null;
  }

  const handleSubmit = () => {
    setSubmitting(true);

    const refillRequest = {
      id: `refill-${Date.now()}`,
      prescriptionId: prescription.id,
      pharmacyId: "pharm-1",
      pharmacyName: selectedPharmacy,
      deliveryAddress: deliveryAddress || "123 Main Street, San Francisco, CA 94102",
      notes,
      requestedDate: new Date().toISOString(),
      status: "pending" as const,
    };

    createRefillRequest(refillRequest);
    
    updatePrescription(prescription.id, {
      status: "refill_requested",
    });

    createNotification({
      id: `notif-${Date.now()}`,
      type: "prescription_ready",
      title: "Refill Request Submitted",
      message: `Your refill request for ${prescription.medication.name} has been submitted to ${selectedPharmacy}`,
      date: new Date().toISOString(),
      read: false,
      actionable: false,
    });

    setTimeout(() => {
      setSubmitting(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <ScreenKeyboardAwareScrollView
      contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}
    >
      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>Prescription</ThemedText>
          <ThemedText style={styles.medicationName}>{prescription.medication.name}</ThemedText>
          <ThemedText style={[styles.dosage, { color: theme.textSecondary }]}>
            {prescription.dosage} • {prescription.frequency}
          </ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>Pharmacy</ThemedText>
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            {selectedPharmacy}
          </ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>Delivery Address</ThemedText>
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            123 Main Street, San Francisco, CA 94102
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title={submitting ? "Submitting..." : "Submit Refill Request"}
            onPress={handleSubmit}
            disabled={submitting}
          />
        </View>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  dosage: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
  },
  actions: {
    marginTop: Spacing.md,
  },
});
