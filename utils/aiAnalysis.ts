import {
  AIAnalysisResult,
  Prescription,
  Medication,
  MedicationPrice,
} from "@/types/data";

export async function generateMockAnalysis(
  prescription: Prescription,
  allMedications: Medication[],
  medicationPrices: MedicationPrice[],
): Promise<AIAnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const priceData = medicationPrices.find(
    (mp) => mp.medicationId === prescription.medicationId,
  );

  const genericAlternatives = allMedications.filter(
    (med) =>
      med.genericName &&
      med.genericName.toLowerCase() ===
        prescription.medication.genericName?.toLowerCase() &&
      med.id !== prescription.medicationId,
  );

  const recommendations = genericAlternatives.map((alt) => {
    const altPrice = medicationPrices.find((mp) => mp.medicationId === alt.id);
    const currentLowest = priceData?.lowestPrice || 0;
    const altLowest = altPrice?.lowestPrice || currentLowest;
    const savings = currentLowest - altLowest;

    return {
      alternative: alt.name,
      reason: `${alt.name} is a generic equivalent that may cost less while providing the same therapeutic benefit.`,
      potentialSavings: Math.max(savings, 0),
    };
  });

  const commonInteractions = getCommonInteractions(
    prescription.medication.name,
  );
  const safetyWarnings = getSafetyWarnings(prescription.medication);

  const analysisId = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: analysisId,
    prescriptionId: prescription.id,
    analyzedDate: new Date().toISOString(),
    detectedMedications: [
      {
        name: prescription.medication.name,
        dosage: prescription.dosage,
        confidence: 0.98,
      },
    ],
    recommendations: recommendations.filter((rec) => rec.potentialSavings > 0),
    warnings: safetyWarnings,
    interactions: commonInteractions,
    summary: generateSummary(
      prescription,
      recommendations,
      priceData?.lowestPrice || 0,
      priceData?.averagePrice || 0,
    ),
    priceInsights: {
      averagePrice: priceData?.averagePrice || 0,
      lowestPrice: priceData?.lowestPrice || 0,
      potentialSavings:
        recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0) ||
        0,
    },
  };
}

function getCommonInteractions(medicationName: string): string[] {
  const interactionMap: Record<string, string[]> = {
    Atorvastatin: [
      "May interact with grapefruit juice - avoid consuming grapefruit",
      "Use caution when taking with other cholesterol medications",
      "May increase risk of muscle problems when combined with certain antibiotics",
    ],
    Lisinopril: [
      "May increase potassium levels - limit potassium-rich foods",
      "NSAIDs (like ibuprofen) may reduce effectiveness",
      "Avoid salt substitutes containing potassium",
    ],
    Metformin: [
      "May interact with alcohol - limit alcohol consumption",
      "Contrast dye used in imaging may affect kidney function",
      "Report any unusual muscle pain immediately",
    ],
    Amlodipine: [
      "Grapefruit may increase medication levels - avoid grapefruit products",
      "May cause dizziness - use caution when standing up quickly",
      "Alcohol may enhance blood pressure lowering effects",
    ],
    Omeprazole: [
      "May reduce absorption of certain vitamins and minerals",
      "Can interact with blood thinners like warfarin",
      "May affect effectiveness of some antifungal medications",
    ],
  };

  return (
    interactionMap[medicationName] || [
      "Always inform healthcare providers of all medications you're taking",
      "Report any unusual symptoms to your doctor promptly",
    ]
  );
}

function getSafetyWarnings(medication: Medication): string[] {
  const warnings: string[] = [];

  if (medication.sideEffects && medication.sideEffects.length > 0) {
    warnings.push(
      `Common side effects may include: ${medication.sideEffects.slice(0, 3).join(", ")}`,
    );
  }

  const medName = medication.name.toLowerCase();

  if (medName.includes("statin")) {
    warnings.push(
      "Monitor for muscle pain or weakness - contact doctor if experienced",
    );
    warnings.push("Regular liver function tests recommended");
  }

  if (medName.includes("metformin")) {
    warnings.push("Take with food to reduce stomach upset");
    warnings.push("Stay well hydrated, especially during illness");
  }

  if (
    medName.includes("lisinopril") ||
    medName.includes("amlodipine") ||
    medName.includes("pressure")
  ) {
    warnings.push("Monitor blood pressure regularly");
    warnings.push(
      "Rise slowly from sitting or lying position to avoid dizziness",
    );
  }

  warnings.push(
    "Do not stop taking this medication without consulting your doctor",
  );

  return warnings;
}

function generateSummary(
  prescription: Prescription,
  recommendations: Array<{ alternative: string; potentialSavings: number }>,
  lowestPrice: number,
  averagePrice: number,
): string {
  const parts: string[] = [];

  parts.push(
    `Analysis of ${prescription.medication.name} (${prescription.dosage}) prescribed for ${prescription.frequency} use.`,
  );

  if (recommendations.length > 0) {
    const totalSavings = recommendations.reduce(
      (sum, rec) => sum + rec.potentialSavings,
      0,
    );
    parts.push(
      `Found ${recommendations.length} cost-saving alternative${recommendations.length > 1 ? "s" : ""} with potential savings up to $${totalSavings.toFixed(2)}.`,
    );
  } else {
    parts.push("Currently taking the most cost-effective option available.");
  }

  if (averagePrice > 0 && lowestPrice > 0) {
    const priceDiff = averagePrice - lowestPrice;
    if (priceDiff > 1) {
      parts.push(
        `You can save $${priceDiff.toFixed(2)} by choosing the lowest-priced pharmacy.`,
      );
    }
  }

  parts.push(
    "Please review the recommendations and warnings below. Always consult with your healthcare provider before making any changes to your medication regimen.",
  );

  return parts.join(" ");
}
