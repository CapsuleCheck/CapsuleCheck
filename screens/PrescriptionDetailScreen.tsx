import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CapsuleIcon } from "@/components/CapsuleIcon";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { usePrescriptions, useAIAnalyses } from "@/hooks/useAppDataHooks";
import { useAppData } from "@/context/AppDataContext";
import { BorderRadius, Spacing, Colors } from "@/constants/theme";
import { MyRxStackParamList } from "@/navigation/MyRxStackNavigator";

type PrescriptionDetailRouteProp = RouteProp<MyRxStackParamList, "PrescriptionDetail">;
type NavigationProp = NativeStackNavigationProp<MyRxStackParamList>;

export default function PrescriptionDetailScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const route = useRoute<PrescriptionDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { prescriptionId } = route.params;
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const prescriptions = usePrescriptions();
  const analyses = useAIAnalyses();
  const { createPrescriptionAnalysis } = useAppData();
  
  const prescription = prescriptions.getById(prescriptionId);
  const analysis = prescription?.analysisId 
    ? analyses.getById(prescription.analysisId) 
    : null;

  if (!prescription) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText style={[styles.errorText, { color: theme.textSecondary }]}>
          Prescription not found
        </ThemedText>
      </View>
    );
  }

  const handleRequestRefill = () => {
    if (prescription.refillsRemaining === 0) {
      Alert.alert(
        "No Refills Remaining",
        "You have no refills remaining on this prescription. Please contact your prescriber.",
        [{ text: "OK" }]
      );
      return;
    }
    navigation.navigate("RefillRequest", { prescriptionId });
  };

  const handleViewAnalysis = () => {
    if (analysis) {
      navigation.navigate("AnalysisResults", { analysisId: analysis.id });
    }
  };

  const handleComparePrices = () => {
    navigation.navigate("ComparePrices", { medicationId: prescription.medicationId });
  };

  const handleAnalyzePrescription = async () => {
    setIsAnalyzing(true);
    try {
      const analysisId = await createPrescriptionAnalysis(prescriptionId);
      navigation.navigate("AnalysisResults", { analysisId });
    } catch (error) {
      console.error("Failed to analyze prescription:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.success;
      case "pending_refill":
        return theme.warning;
      case "refill_requested":
        return theme.primary;
      case "expired":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "pending_refill":
        return "Refill Due Soon";
      case "refill_requested":
        return "Refill Requested";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  return (
    <ScreenScrollView contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}>
      <View style={styles.content}>
        <View style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
            <CapsuleIcon size={32} color={theme.primary} />
          </View>
          <View style={styles.headerInfo}>
            <ThemedText style={styles.medicationName}>{prescription.medication.name}</ThemedText>
            <ThemedText style={[styles.dosage, { color: theme.textSecondary }]}>
              {prescription.dosage} • {prescription.frequency}
            </ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(prescription.status) + "20" }]}>
              <ThemedText style={[styles.statusText, { color: getStatusColor(prescription.status) }]}>
                {getStatusText(prescription.status)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>Prescription Details</ThemedText>
          
          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Prescribed by
            </ThemedText>
            <ThemedText style={styles.detailValue}>{prescription.prescriberName}</ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Date Issued
            </ThemedText>
            <ThemedText style={styles.detailValue}>
              {new Date(prescription.dateIssued).toLocaleDateString()}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Expiration Date
            </ThemedText>
            <ThemedText style={styles.detailValue}>
              {new Date(prescription.expirationDate).toLocaleDateString()}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Quantity
            </ThemedText>
            <ThemedText style={styles.detailValue}>{prescription.quantity} tablets</ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Refills Remaining
            </ThemedText>
            <ThemedText style={styles.detailValue}>
              {prescription.refillsRemaining} of {prescription.totalRefills}
            </ThemedText>
          </View>

          {prescription.nextRefillDate && (
            <View style={styles.detailRow}>
              <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                Next Refill Date
              </ThemedText>
              <ThemedText style={[styles.detailValue, { color: theme.warning }]}>
                {new Date(prescription.nextRefillDate).toLocaleDateString()}
              </ThemedText>
            </View>
          )}
        </View>

        {prescription.instructions && (
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText style={styles.sectionTitle}>Instructions</ThemedText>
            <ThemedText style={[styles.instructions, { color: theme.textSecondary }]}>
              {prescription.instructions}
            </ThemedText>
          </View>
        )}

        {prescription.medication.sideEffects && prescription.medication.sideEffects.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText style={styles.sectionTitle}>Common Side Effects</ThemedText>
            {prescription.medication.sideEffects.map((effect, index) => (
              <View key={index} style={styles.listItem}>
                <Feather name="alert-circle" size={16} color={theme.textSecondary} />
                <ThemedText style={[styles.listText, { color: theme.textSecondary }]}>
                  {effect}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.aiSection, { backgroundColor: theme.card, borderColor: theme.primary }]}>
          <View style={styles.aiHeader}>
            <Feather name="zap" size={20} color={theme.primary} />
            <ThemedText style={[styles.aiTitle, { color: theme.primary }]}>
              AI-Powered Analysis
            </ThemedText>
          </View>
          
          {analysis ? (
            <>
              <ThemedText style={[styles.aiDescription, { color: theme.text }]}>
                AI analysis complete. View cost-saving recommendations and safety insights.
              </ThemedText>
              <PrimaryButton
                title="View Analysis Results"
                onPress={handleViewAnalysis}
                style={styles.aiButton}
              />
            </>
          ) : (
            <>
              <ThemedText style={[styles.aiDescription, { color: theme.text }]}>
                Get personalized recommendations, cost-saving alternatives, and safety insights powered by AI.
              </ThemedText>
              <PrimaryButton
                title={isAnalyzing ? "Analyzing..." : "Analyze Prescription"}
                onPress={handleAnalyzePrescription}
                disabled={isAnalyzing}
                loading={isAnalyzing}
                style={styles.aiButton}
              />
            </>
          )}
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Request Refill"
            onPress={handleRequestRefill}
            disabled={prescription.refillsRemaining === 0 || prescription.status === "expired"}
            style={styles.actionButton}
          />
          
          <PrimaryButton
            title="Compare Prices"
            onPress={handleComparePrices}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  dosage: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  instructions: {
    fontSize: 14,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  listText: {
    fontSize: 14,
    flex: 1,
  },
  aiSection: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    marginBottom: Spacing.lg,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  aiDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  aiButton: {
    marginTop: Spacing.sm,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  actionButton: {
    width: "100%",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});
