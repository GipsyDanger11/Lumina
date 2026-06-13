import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T } from "../../lib/theme";

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home",
  hydration: "water",
  sleep: "moon",
  habits: "checkmark-circle",
  nutrition: "restaurant",
  reports: "stats-chart",
  companion: "sparkles",
  profile: "person",
};

const TAB_LABELS: Record<string, string> = {
  index: "Home",
  hydration: "Water",
  sleep: "Sleep",
  habits: "Habits",
  nutrition: "Nutrition",
  reports: "Reports",
  companion: "LuminaAI",
  profile: "Profile",
};

const TAB_COLORS: Record<string, string> = {
  index: T.accent.purple,
  hydration: T.accent.teal,
  sleep: T.accent.purple,
  habits: T.accent.coral,
  nutrition: T.accent.gold,
  reports: T.accent.blue,
  companion: T.accent.pink,
  profile: T.accent.purple,
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 60 + Math.max(insets.bottom, 16),
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 16),
          position: "absolute" as const,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.3,
              shadowRadius: 24,
            },
            android: { elevation: 16 },
          }),
        },
        tabBarBackground: () => (
          <View
            style={{
              ...Platform.select({
                ios: { backgroundColor: "rgba(11, 11, 26, 0.85)" },
                android: { backgroundColor: "rgba(11, 11, 26, 0.95)" },
              }),
              position: "absolute" as const,
              bottom: 0,
              left: 0,
              right: 0,
              height: 60 + Math.max(insets.bottom, 16),
            }}
          >
            <View style={tabStyles.glassBorder} />
          </View>
        ),
        tabBarActiveTintColor: T.accent.purple,
        tabBarInactiveTintColor: T.text.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600" as const,
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      {/* Visible tabs (5 main) */}
      <Tabs.Screen
        name="index"
        options={{
          title: TAB_LABELS.index,
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" color={TAB_COLORS.index} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="hydration"
        options={{
          title: TAB_LABELS.hydration,
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="water" color={TAB_COLORS.hydration} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: TAB_LABELS.sleep,
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="moon" color={TAB_COLORS.sleep} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: TAB_LABELS.habits,
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="checkmark-circle" color={TAB_COLORS.habits} focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: TAB_LABELS.nutrition,
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="restaurant" color={TAB_COLORS.nutrition} focused={focused} size={size} />
          ),
        }}
      />

      {/* Hidden tabs (accessible from Home screen) */}
      <Tabs.Screen
        name="reports"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="companion"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  name,
  color,
  focused,
  size,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  size: number;
}) {
  return (
    <View style={tabStyles.iconWrap}>
      {focused && (
        <View
          style={[
            tabStyles.activeGlow,
            { backgroundColor: `${color}20` },
          ]}
        />
      )}
      <Ionicons
        name={name}
        size={size}
        color={focused ? color : T.text.muted}
      />
      {focused && <View style={[tabStyles.activeIndicator, { backgroundColor: color }]} />}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  glassBorder: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  iconWrap: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    width: 48,
    height: 32,
  },
  activeGlow: {
    position: "absolute" as const,
    inset: -8,
    borderRadius: 16,
  },
  activeIndicator: {
    position: "absolute" as const,
    bottom: -10,
    width: 16,
    height: 3,
    borderRadius: 1.5,
  },
});
