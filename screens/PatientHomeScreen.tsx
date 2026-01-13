import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrescriptionCard } from "@/components/PrescriptionCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { BorderRadius, Spacing } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { useUser } from "@/context/UserContext";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function PatientHomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const screenInsets = useScreenInsets();
  const { userData } = useUser();

  const mockPrescriptions = [
    {
      id: "1",
      name: "Atorvastatin 20mg",
      status: "Refill due in 3 days",
      statusColor: theme.warning,
    },
    {
      id: "2",
      name: "Lisinopril 10mg",
      status: "Status: Active",
      statusColor: theme.success,
    },
  ];

  return (
    <ScreenScrollView
      contentContainerStyle={{ paddingBottom: screenInsets.paddingBottom + 70 }}
    >
      <View style={[styles.header, { paddingTop: screenInsets.paddingTop }]}>
        <View>
          <ThemedText style={[styles.greeting, { color: theme.textSecondary }]}>
            Welcome, {userData?.firstName || "Mefe"}
          </ThemedText>
          <ThemedText style={styles.subGreeting}>
            Your CapsuleCheck Hub
          </ThemedText>
        </View>
        <Pressable style={styles.notificationButton}>
          <Feather name='bell' size={24} color={theme.text} />
        </Pressable>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>
            Affordable Alternatives
          </ThemedText>
          <ThemedText
            style={[styles.cardSubtitle, { color: theme.textSecondary }]}
          >
            Find the best prices for your prescriptions.
          </ThemedText>
        </View>
        <PrimaryButton
          title='Compare Prices'
          onPress={() => navigation.navigate("PriceList")}
          style={styles.cardButton}
        />
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Consult a Prescriber</ThemedText>
          <ThemedText
            style={[styles.cardSubtitle, { color: theme.textSecondary }]}
          >
            Book an appointment with an independent prescriber.
          </ThemedText>
        </View>
        <PrimaryButton
          title='Book Appointment'
          onPress={() => navigation.navigate("PrescribersList")}
          variant='secondary'
          style={styles.cardButton}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>My Prescriptions</ThemedText>
          <Pressable>
            <ThemedText style={[styles.viewAll, { color: theme.primary }]}>
              View All
            </ThemedText>
          </Pressable>
        </View>

        {mockPrescriptions.map((prescription) => (
          <PrescriptionCard
            key={prescription.id}
            name={prescription.name}
            status={prescription.status}
            statusColor={prescription.statusColor}
            onPress={() => {}}
          />
        ))}

        <Pressable
          style={({ pressed }) => [
            styles.addCard,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => navigation.navigate("UploadPrescription")}
        >
          <Feather name='plus' size={20} color={theme.primary} />
          <ThemedText style={[styles.addText, { color: theme.primary }]}>
            Add New Prescription
          </ThemedText>
          <Feather name='chevron-right' size={20} color={theme.primary} />
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: theme.primary,
            bottom: screenInsets.paddingBottom + 70,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={() => navigation.navigate("UploadPrescription")}
      >
        <Feather name='camera' size={24} color='#FFFFFF' />
      </Pressable>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: 14,
  },
  subGreeting: {
    fontSize: 20,
    fontWeight: "600",
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  cardHeader: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  cardButton: {
    width: "100%",
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "500",
  },
  addCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addText: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: 16,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
});
