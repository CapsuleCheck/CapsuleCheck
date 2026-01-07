import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";

type FAQ = {
  question: string;
  answer: string;
};

export default function HelpSupportScreen() {
  const { theme } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: "How do I request a prescription refill?",
      answer:
        "Navigate to the My Rx tab, select your prescription, and tap 'Request Refill'. You can choose your preferred pharmacy and delivery method.",
    },
    {
      question: "What is AI-Powered Analysis?",
      answer:
        "Our AI analyzes your prescriptions to provide cost-saving recommendations, safety insights, and alternative medication options. Tap 'Analyze Prescription' on any prescription detail page.",
    },
    {
      question: "How do I compare medication prices?",
      answer:
        "Open any prescription and tap 'Compare Prices' to see prices from different pharmacies in your area. You can sort by price, distance, or pharmacy name.",
    },
    {
      question: "How do I book an appointment with a prescriber?",
      answer:
        "Go to the Prescribers tab, browse available prescribers, and tap 'Book Appointment' to schedule a consultation.",
    },
    {
      question: "Is my medical information secure?",
      answer:
        "Yes. All your medical data is encrypted and stored securely. We comply with HIPAA regulations and never share your information without your consent.",
    },
    {
      question: "How do I update my payment method?",
      answer:
        "Go to Profile > Payment Methods to add, remove, or set a default payment method. All payment information is encrypted and secure.",
    },
  ];

  const contactOptions = [
    {
      icon: "mail" as keyof typeof Feather.glyphMap,
      title: "Email Support",
      subtitle: "support@capsulecheck.com",
      action: "Email",
    },
    {
      icon: "phone" as keyof typeof Feather.glyphMap,
      title: "Phone Support",
      subtitle: "+1 (800) 123-4567",
      action: "Call",
    },
    {
      icon: "message-circle" as keyof typeof Feather.glyphMap,
      title: "Live Chat",
      subtitle: "Available 9AM - 6PM EST",
      action: "Chat",
    },
  ];

  return (
    <ScreenScrollView>
      <View style={styles.content}>
        <View
          style={[
            styles.section,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>
            Frequently Asked Questions
          </ThemedText>

          {faqs.map((faq, index) => (
            <View key={index}>
              <Pressable
                style={[
                  styles.faqItem,
                  { borderBottomColor: theme.border },
                  index === faqs.length - 1 &&
                    expandedFAQ !== index && { borderBottomWidth: 0 },
                ]}
                onPress={() =>
                  setExpandedFAQ(expandedFAQ === index ? null : index)
                }
              >
                <ThemedText style={styles.faqQuestion}>
                  {faq.question}
                </ThemedText>
                <Feather
                  name={expandedFAQ === index ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>

              {expandedFAQ === index && (
                <View
                  style={[
                    styles.faqAnswer,
                    { borderBottomColor: theme.border },
                  ]}
                >
                  <ThemedText
                    style={[styles.answerText, { color: theme.textSecondary }]}
                  >
                    {faq.answer}
                  </ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>Contact Support</ThemedText>
          <ThemedText
            style={[styles.sectionDescription, { color: theme.textSecondary }]}
          >
            Need more help? Our support team is here for you.
          </ThemedText>

          {contactOptions.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.contactItem,
                { borderBottomColor: theme.border },
                index === contactOptions.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => {}}
            >
              <View
                style={[
                  styles.contactIcon,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Feather name={option.icon} size={20} color={theme.primary} />
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactTitle}>
                  {option.title}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.contactSubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  {option.subtitle}
                </ThemedText>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>Resources</ThemedText>

          <Pressable
            style={[styles.resourceItem, { borderBottomColor: theme.border }]}
            onPress={() => {}}
          >
            <Feather name="book-open" size={20} color={theme.text} />
            <ThemedText style={styles.resourceText}>User Guide</ThemedText>
            <Feather
              name="external-link"
              size={16}
              color={theme.textSecondary}
            />
          </Pressable>

          <Pressable
            style={[styles.resourceItem, { borderBottomColor: theme.border }]}
            onPress={() => {}}
          >
            <Feather name="video" size={20} color={theme.text} />
            <ThemedText style={styles.resourceText}>Tutorial Videos</ThemedText>
            <Feather
              name="external-link"
              size={16}
              color={theme.textSecondary}
            />
          </Pressable>

          <Pressable style={styles.resourceItem} onPress={() => {}}>
            <Feather name="file-text" size={20} color={theme.text} />
            <ThemedText style={styles.resourceText}>Documentation</ThemedText>
            <Feather
              name="external-link"
              size={16}
              color={theme.textSecondary}
            />
          </Pressable>
        </View>

        <PrimaryButton title="Submit Feedback" onPress={() => {}} />
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
  },
  section: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  sectionDescription: {
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    flex: 1,
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    marginRight: Spacing.md,
  },
  faqAnswer: {
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  answerText: {
    fontSize: Typography.sizes.sm,
    lineHeight: 22,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    marginBottom: Spacing.xxs,
  },
  contactSubtitle: {
    fontSize: Typography.sizes.sm,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  resourceText: {
    flex: 1,
    fontSize: Typography.sizes.md,
    fontWeight: "500",
  },
});
