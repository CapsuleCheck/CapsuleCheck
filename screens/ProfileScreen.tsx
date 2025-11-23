import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { useAppData } from "@/context/AppDataContext";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";
import { BorderRadius, Spacing } from "@/constants/theme";

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, "Profile">;

type MenuItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  screen: keyof ProfileStackParamList;
};

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme } = useTheme();
  const { setUserRole, userRole } = useUser();
  const { state } = useAppData();
  const userProfile = state.userProfile;

  const menuItems: MenuItem[] = [
    { icon: "user", label: "Personal Information", screen: "PersonalInformation" },
    { icon: "bell", label: "Notifications", screen: "Notifications" },
    { icon: "lock", label: "Privacy & Security", screen: "PrivacySecurity" },
    { icon: "credit-card", label: "Payment Methods", screen: "PaymentMethods" },
    { icon: "help-circle", label: "Help & Support", screen: "HelpSupport" },
    { icon: "info", label: "About CapsuleCheck", screen: "About" },
  ];

  const handleLogout = () => {
    setUserRole(null);
  };

  const handleMenuPress = (screen: keyof ProfileStackParamList) => {
    if (screen !== "Profile") {
      navigation.navigate(screen);
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}>
          <Feather name="user" size={40} color={theme.primary} />
        </View>
        <ThemedText style={styles.name}>
          {userProfile?.name || (userRole === "patient" ? "Patient" : "Prescriber")}
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: theme.primary + "20" }]}>
          <ThemedText style={[styles.badgeText, { color: theme.primary }]}>
            {userRole === "patient" ? "Patient" : "Prescriber"}
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
            onPress={() => handleMenuPress(item.screen)}
          >
            <Feather name={item.icon} size={20} color={theme.text} />
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
