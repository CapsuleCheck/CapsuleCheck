import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenFlatList } from "@/components/ScreenFlatList";
import { PrescriberCard } from "@/components/PrescriberCard";
import { Spacing } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const MOCK_PRESCRIBERS = [
  {
    id: "1",
    name: "Dr. Evelyn Reed",
    rating: 4.8,
    reviews: 214,
    time: "11:30 AM",
    type: "Video Call",
  },
  {
    id: "2",
    name: "Dr. Marcus Chen",
    rating: 4.9,
    reviews: 187,
    time: "01:00 PM",
    type: "In-Person",
  },
  {
    id: "3",
    name: "Dr. Sarah Williams",
    rating: 4.7,
    reviews: 156,
    time: "02:30 PM",
    type: "Video Call",
  },
];

export default function PharmaciesScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScreenFlatList
      data={MOCK_PRESCRIBERS}
      renderItem={({ item }) => (
        <PrescriberCard
          name={item.name}
          rating={item.rating}
          reviews={item.reviews}
          time={item.time}
          type={item.type}
          onPress={() => navigation.navigate("BookAppointment", { prescriberId: item.id })}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: Spacing.xl }}
    />
  );
}

const styles = StyleSheet.create({});

