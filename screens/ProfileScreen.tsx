import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { BorderRadius, Spacing } from "@/constants/theme";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { setUserRole, userRole } = useUser();

  const menuItems = [
    { icon: "user", label: "Personal Information" },
    { icon: "bell", label: "Notifications" },
    { icon: "lock", label: "Privacy & Security" },
    { icon: "credit-card", label: "Payment Methods" },
    { icon: "help-circle", label: "Help & Support" },
    { icon: "info", label: "About CapsuleCheck" },
  ];

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <ScreenScrollView>
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}>
          <Feather name="user" size={40} color={theme.primary} />
        </View>
        <ThemedText style={styles.name}>
          {userRole === "patient" ? "Mefe Johnson" : "Dr. Evelyn Reed"}
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: theme.primary + "20" }]}>
          <ThemedText style={[styles.badgeText, { color: theme.primary }]}>
            {userRole === "patient" ? "Patient" : "Pharmacist"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather name={item.icon as any} size={20} color={theme.text} />
            <ThemedText style={styles.menuText}>{item.label}</ThemedText>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <PrimaryButton
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
        />
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  menuSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing["3xl"],
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: 16,
  },
  logoutSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing["3xl"],
  },
});
