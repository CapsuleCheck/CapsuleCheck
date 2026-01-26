import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import { usePrescriberProfile } from "@/hooks/useAppDataHooks";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";
import { BorderRadius, Spacing } from "@/constants/theme";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "Profile"
>;

type MenuItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  screen: keyof ProfileStackParamList;
};

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme } = useTheme();
  const { setUserRole, userRole, userData } = useUser();
  const prescriberProfile = usePrescriberProfile();

  const menuItems: MenuItem[] = [
    {
      icon: "user",
      label: "Personal Information",
      screen: "PersonalInformation",
    },
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
  // Get display data based on user role (userData structure)
  const displayName =
    userRole === "prescriber"
      ? prescriberProfile?.name || "Prescriber"
      : userData?.name ||
        [userData?.firstName, userData?.lastName].filter(Boolean).join(" ").trim() ||
        "Patient";

  const displayEmail =
    userRole === "prescriber"
      ? prescriberProfile?.email || ""
      : userData?.email || "";

  const displayPhone =
    userRole === "prescriber"
      ? prescriberProfile?.phoneNumber || ""
      : (userData?.phone ?? userData?.phoneNumber ?? "");

  return (
    <ScreenScrollView>
      <View style={styles.profileSection}>
        <View
          style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
        >
          <Feather name='user' size={40} color={theme.primary} />
        </View>
        <ThemedText style={styles.name}>{displayName}</ThemedText>
        {userRole === "prescriber" && prescriberProfile?.title && (
          <ThemedText style={[styles.title, { color: theme.textSecondary }]}>
            {prescriberProfile.title}
          </ThemedText>
        )}
        <View style={[styles.badge, { backgroundColor: theme.primary + "20" }]}>
          <ThemedText style={[styles.badgeText, { color: theme.primary }]}>
            {userRole === "patient" ? "Patient" : "Prescriber"}
          </ThemedText>
        </View>
      </View>

      {/* User Details Section */}
      <View style={styles.detailsSection}>
        {/* {displayEmail && (
          <View style={styles.detailRow}>
            <Feather name='mail' size={18} color={theme.textSecondary} />
            <ThemedText style={[styles.detailText, { color: theme.text }]}>
              {displayEmail}
            </ThemedText>
          </View>
        )} */}
        {/* {displayPhone && (
          <View style={styles.detailRow}>
            <Feather name='phone' size={18} color={theme.textSecondary} />
            <ThemedText style={[styles.detailText, { color: theme.text }]}>
              {displayPhone}
            </ThemedText>
          </View>
        )} */}

        {/* Prescriber-specific details */}
        {userRole === "prescriber" && prescriberProfile && (
          <>
            {prescriberProfile.specialty &&
              prescriberProfile.specialty.length > 0 && (
                <View style={styles.detailRow}>
                  <Feather
                    name='briefcase'
                    size={18}
                    color={theme.textSecondary}
                  />
                  <View style={styles.specialtyContainer}>
                    {prescriberProfile.specialty.map((spec, index) => (
                      <View
                        key={index}
                        style={[
                          styles.specialtyChip,
                          { backgroundColor: theme.primary + "20" },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.specialtyText,
                            { color: theme.primary },
                          ]}
                        >
                          {spec}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            {prescriberProfile.yearsExperience > 0 && (
              <View style={styles.detailRow}>
                <Feather name='award' size={18} color={theme.textSecondary} />
                <ThemedText style={[styles.detailText, { color: theme.text }]}>
                  {prescriberProfile.yearsExperience} years of experience
                </ThemedText>
              </View>
            )}
            {prescriberProfile.ratings > 0 && (
              <View style={styles.detailRow}>
                <Feather name='star' size={18} color='#F59E0B' />
                <ThemedText style={[styles.detailText, { color: theme.text }]}>
                  {prescriberProfile.ratings.toFixed(1)} (
                  {prescriberProfile.ratingsCount} reviews)
                </ThemedText>
              </View>
            )}
            {prescriberProfile.consultationFee && (
              <View style={styles.detailRow}>
                <Feather
                  name='dollar-sign'
                  size={18}
                  color={theme.textSecondary}
                />
                <ThemedText style={[styles.detailText, { color: theme.text }]}>
                  ${prescriberProfile.consultationFee} consultation fee
                </ThemedText>
              </View>
            )}
            {prescriberProfile.bio && (
              <View style={styles.bioSection}>
                <ThemedText
                  style={[styles.bioLabel, { color: theme.textSecondary }]}
                >
                  Bio
                </ThemedText>
                <ThemedText style={[styles.bioText, { color: theme.text }]}>
                  {prescriberProfile.bio}
                </ThemedText>
              </View>
            )}
          </>
        )}

        {/* Patient-specific details (userData structure) */}
        {userRole === "patient" && userData?.address && (
          <>
            {(userData.address.street || userData.address.city) && (
              <View style={styles.detailRow}>
                <Feather name='map-pin' size={18} color={theme.textSecondary} />
                <ThemedText style={[styles.detailText, { color: theme.text }]}>
                  {[
                    userData.address.street,
                    userData.address.city,
                    userData.address.state,
                    userData.address.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </ThemedText>
              </View>
            )}
            {userData.insuranceProvider && (
              <View style={styles.detailRow}>
                <Feather name='shield' size={18} color={theme.textSecondary} />
                <ThemedText style={[styles.detailText, { color: theme.text }]}>
                  {userData.insuranceProvider}
                </ThemedText>
              </View>
            )}
          </>
        )}
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
            <Feather
              name='chevron-right'
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <PrimaryButton
          title='Log Out'
          onPress={handleLogout}
          variant='outline'
        />
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
    paddingHorizontal: Spacing.xl,
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
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 16,
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
  detailsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    gap: Spacing.md,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
  },
  specialtyContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  specialtyChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  bioSection: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
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
