import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { T } from "../lib/theme";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Meet your personal\nhealth companion.",
    icon: "sparkles" as const,
    color: T.accent.purple,
  },
  {
    id: "2",
    title: "Track hydration, sleep,\nhabits, and nutrition.",
    icon: "stats-chart" as const,
    color: T.accent.teal,
  },
  {
    id: "3",
    title: "Receive personalized\ndaily insights.",
    icon: "bulb" as const,
    color: T.accent.gold,
  },
  {
    id: "4",
    title: "Build healthier routines\nthrough consistency.",
    icon: "flame" as const,
    color: T.accent.coral,
  },
  {
    id: "5",
    title: "Learn more about\nyourself every day.",
    icon: "heart" as const,
    color: T.accent.pink,
  },
];

export default function LandingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const orbAnim1 = useRef(new Animated.Value(0)).current;
  const orbAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnim1, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(orbAnim1, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnim2, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(orbAnim2, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const orb1Translate = orbAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const orb2Translate = orbAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <View style={S_screen}>
      {/* Animated gradient orbs */}
      <View style={S_orbContainer}>
        <Animated.View
          style={[
            S_orb1,
            {
              opacity: orbAnim1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.15, 0.3],
              }),
              transform: [{ translateY: orb1Translate }, { translateX: orb1Translate }],
            },
          ]}
        />
        <Animated.View
          style={[
            S_orb2,
            {
              opacity: orbAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.25],
              }),
              transform: [{ translateY: orb2Translate }, { translateX: orb2Translate }],
            },
          ]}
        />
        <View style={S_orb3} />
      </View>

      <Animated.View
        style={[
          S_content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Logo */}
        <View style={S_logoSection}>
          <View style={S_logoOuter}>
            <View style={S_logoGlow} />
            <View style={S_logoInner}>
              <Ionicons name="sparkles" size={32} color={T.accent.purple} />
            </View>
          </View>
          <Text style={S_logoText}>Lumina</Text>
          <Text style={S_tagline}>Understand yourself better, every day.</Text>
        </View>

        {/* Carousel */}
        <View style={S_carouselWrap}>
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            horizontal
            pagingEnabled
            snapToInterval={width - 64}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            renderItem={({ item }) => (
              <View style={[S_slide, { width: width - 64 }]}>
                <View style={S_slideIconWrap}>
                  <View
                    style={[
                      S_slideIconBg,
                      { backgroundColor: `${item.color}15` },
                    ]}
                  />
                  <View
                    style={[
                      S_slideIcon,
                      {
                        backgroundColor: `${item.color}20`,
                        borderColor: `${item.color}30`,
                      },
                    ]}
                  >
                    <Ionicons name={item.icon} size={36} color={item.color} />
                  </View>
                </View>
                <Text style={S_slideTitle}>{item.title}</Text>
              </View>
            )}
          />
        </View>

        {/* Dot indicators */}
        <View style={S_dots}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                S_dot,
                index === currentIndex ? S_dotActive : S_dotInactive,
                index === currentIndex && {
                  backgroundColor: T.accent.purple,
                  width: 28,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Bottom Buttons */}
      <View style={S_buttons}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          style={S_getStarted}
          activeOpacity={0.8}
        >
          <View style={S_getStartedInner}>
            <View style={[S_getStartedGlow, { backgroundColor: `${T.accent.coral}30` }]} />
            <Text style={S_getStartedText}>Get Started</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(guest)/explore")}
          style={S_explore}
          activeOpacity={0.8}
        >
          <Ionicons name="compass-outline" size={18} color={T.text.muted} />
          <Text style={S_exploreText}>Explore without account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const S_screen = {
  flex: 1,
  backgroundColor: T.bg.primary,
};

const S_orbContainer = {
  ...Platform.select({
    ios: { position: "absolute" as const, inset: 0 },
    android: { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0 },
  }),
  overflow: "hidden" as const,
};

const S_orb1 = {
  position: "absolute" as const,
  top: -80,
  left: -60,
  width: 300,
  height: 300,
  borderRadius: 150,
  backgroundColor: T.accent.purple,
};

const S_orb2 = {
  position: "absolute" as const,
  bottom: 100,
  right: -80,
  width: 260,
  height: 260,
  borderRadius: 130,
  backgroundColor: T.accent.teal,
};

const S_orb3 = {
  position: "absolute" as const,
  top: height * 0.4,
  left: width * 0.5,
  width: 200,
  height: 200,
  borderRadius: 100,
  backgroundColor: T.accent.coral,
  opacity: 0.08,
  marginLeft: -100,
  marginTop: -100,
};

const S_content = {
  flex: 1,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  paddingHorizontal: 32,
};

const S_logoSection = {
  alignItems: "center" as const,
  marginBottom: 48,
};

const S_logoOuter = {
  position: "relative" as const,
  marginBottom: 20,
};

const S_logoGlow = {
  position: "absolute" as const,
  inset: -12,
  borderRadius: 28,
  backgroundColor: `${T.accent.purple}20`,
};

const S_logoInner = {
  width: 64,
  height: 64,
  borderRadius: 20,
  backgroundColor: `${T.accent.purple}20`,
  borderWidth: 1,
  borderColor: `${T.accent.purple}30`,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  ...Platform.select({
    ios: {
      shadowColor: T.accent.purple,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
    },
    android: { elevation: 12 },
  }),
};

const S_logoText = {
  color: T.text.primary,
  fontSize: 34,
  fontWeight: "800" as const,
  letterSpacing: -1,
};

const S_tagline = {
  color: T.text.muted,
  fontSize: 14,
  fontWeight: "500" as const,
  marginTop: 8,
};

const S_carouselWrap = {
  height: 220,
  marginBottom: 20,
};

const S_slide = {
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const S_slideIconWrap = {
  position: "relative" as const,
  marginBottom: 28,
};

const S_slideIconBg = {
  position: "absolute" as const,
  inset: -16,
  borderRadius: 56,
};

const S_slideIcon = {
  width: 88,
  height: 88,
  borderRadius: 44,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  borderWidth: 1,
  ...Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
    },
    android: { elevation: 10 },
  }),
};

const S_slideTitle = {
  color: T.text.primary,
  fontSize: 22,
  fontWeight: "700" as const,
  textAlign: "center" as const,
  lineHeight: 32,
  letterSpacing: -0.3,
};

const S_dots = {
  flexDirection: "row" as const,
  gap: 6,
  marginBottom: 32,
};

const S_dot = {
  borderRadius: 4,
  height: 8,
};

const S_dotActive = {
  backgroundColor: T.accent.purple,
  width: 28,
};

const S_dotInactive = {
  backgroundColor: `${T.text.muted}40`,
  width: 8,
};

const S_buttons = {
  paddingHorizontal: 32,
  paddingBottom: Platform.OS === "ios" ? 48 : 32,
  gap: 12,
};

const S_getStarted = {
  borderRadius: 18,
  overflow: "hidden" as const,
  ...Platform.select({
    ios: {
      shadowColor: T.accent.coral,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
    },
    android: { elevation: 10 },
  }),
};

const S_getStartedInner = {
  backgroundColor: T.accent.coral,
  borderRadius: 18,
  paddingVertical: 18,
  alignItems: "center" as const,
  overflow: "hidden" as const,
};

const S_getStartedGlow = {
  position: "absolute" as const,
  top: -20,
  left: width * 0.3,
  width: width * 0.4,
  height: 40,
  borderRadius: 20,
};

const S_getStartedText = {
  color: T.text.primary,
  fontSize: 17,
  fontWeight: "700" as const,
  letterSpacing: 0.3,
};

const S_explore = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  gap: 8,
  backgroundColor: T.glass.bg,
  borderWidth: 1,
  borderColor: T.glass.border,
  borderRadius: 18,
  paddingVertical: 16,
  ...Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
  }),
};

const S_exploreText = {
  color: T.text.muted,
  fontSize: 15,
  fontWeight: "500" as const,
};
