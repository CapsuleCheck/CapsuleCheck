import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useAIAnalyses } from "@/hooks/useAppDataHooks";
import { BorderRadius, Spacing } from "@/constants/theme";
import { MyRxStackParamList } from "@/navigation/MyRxStackNavigator";

type AnalysisResultsRouteProp = RouteProp<MyRxStackParamList, "AnalysisResults">;

export default function AnalysisResultsScreen() {
  const { theme } = useTheme();
  const screenInsets = useScreenInsets();
  const route = useRoute<AnalysisResultsRouteProp>();
  const { analysisId } = route.params;
  
  const analyses = useAIAnalyses();
  const analysis = analyses.getById(analysisId);

  if (!analysis) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText style={[styles.errorText, { color: theme.textSecondary }]}>
          Analysis not found
        </ThemedText>
      </View>
    );
  }

  return (
    <ScreenScrollView contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom }}>
      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>AI Analysis Summary</ThemedText>
          <ThemedText style={[styles.summary, { color: theme.textSecondary }]}>
            {analysis.summary}
          </ThemedText>
        </View>

        {analysis.detectedMedications.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText style={styles.sectionTitle}>Detected Medications</ThemedText>
            {analysis.detectedMedications.map((med, index) => (
              <View key={index} style={styles.medicationItem}>
                <ThemedText style={styles.medicationName}>{med.name}</ThemedText>
                <ThemedText style={[styles.medicationDosage, { color: theme.textSecondary }]}>
                  {med.dosage}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {analysis.recommendations.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText style={styles.sectionTitle}>Cost-Saving Recommendations</ThemedText>
            {analysis.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <ThemedText style={styles.alternativeName}>{rec.alternative}</ThemedText>
                <ThemedText style={[styles.reason, { color: theme.textSecondary }]}>
                  {rec.reason}
                </ThemedText>
                <ThemedText style={[styles.savings, { color: theme.success }]}>
                  Save ${rec.potentialSavings.toFixed(2)}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>Price Insights</ThemedText>
          <View style={styles.priceRow}>
            <ThemedText style={[styles.priceLabel, { color: theme.textSecondary }]}>
              Average Price:
            </ThemedText>
            <ThemedText style={styles.priceValue}>
              ${analysis.priceInsights.averagePrice.toFixed(2)}
            </ThemedText>
          </View>
          <View style={styles.priceRow}>
            <ThemedText style={[styles.priceLabel, { color: theme.textSecondary }]}>
              Lowest Price:
            </ThemedText>
            <ThemedText style={[styles.priceValue, { color: theme.success }]}>
              ${analysis.priceInsights.lowestPrice.toFixed(2)}
            </ThemedText>
          </View>
          <View style={styles.priceRow}>
            <ThemedText style={[styles.priceLabel, { color: theme.textSecondary }]}>
              Potential Savings:
            </ThemedText>
            <ThemedText style={[styles.priceValue, { color: theme.success, fontWeight: "700" }]}>
              ${analysis.priceInsights.potentialSavings.toFixed(2)}
            </ThemedText>
          </View>
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
  summary: {
    fontSize: 14,
    lineHeight: 20,
  },
  medicationItem: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  medicationDosage: {
    fontSize: 14,
  },
  recommendationItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  alternativeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  reason: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  savings: {
    fontSize: 14,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});
