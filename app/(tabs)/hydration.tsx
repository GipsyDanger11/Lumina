import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useHealth } from "../../hooks/useHealth";
import { WaterBottle } from "../../components/ui/WaterBottle";
import { WeeklyBarChart } from "../../components/charts/WeeklyBarChart";
import { InsightCard } from "../../components/cards/InsightCard";
import { hydrationApi } from "../../lib/api";
import { useUserStore } from "../../store/useUserStore";
import { useHealthStore } from "../../store/useHealthStore";
import { T, S } from "../../lib/theme";

export default function HydrationScreen() {
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const { totalWaterMl, weeklyHydration } = useHealth();
  const user = useUserStore((s) => s.user);
  const isGuest = useUserStore((s) => s.isGuest);
  const store = useHealthStore();
  const goal = 2500;
  const percentage = Math.min((totalWaterMl / goal) * 100, 100);

  const addWater = async (amount: number) => {
    if (isGuest) {
      const { useGuestStore } = await import("../../store/useGuestStore");
      useGuestStore.getState().addGuestWater({
        amount_ml: amount,
        beverage_type: "water",
        timestamp: new Date().toISOString(),
      });
      store.addWater(
        { amount_ml: amount, beverage_type: "water", timestamp: new Date().toISOString() },
        store.todayTotalMl + amount
      );
      return;
    }

    if (!user?.id) return;
    const today = new Date().toISOString().split("T")[0];
    await hydrationApi.add(today, amount);
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      addWater(amount);
      setCustomAmount("");
      setShowCustom(false);
    }
  };

  const quickAmounts = [250, 500, 750];

  return (
    <ScrollView style={S.screen} showsVerticalScrollIndicator={false}>
      <View style={S.scrollContent}>
        <Text
          style={{
            color: T.text.primary,
            fontSize: 28,
            fontWeight: "800",
            letterSpacing: -0.5,
            marginBottom: 24,
          }}
        >
          Hydration
        </Text>

        {/* Hero Bottle Card */}
        <View
          style={{
            backgroundColor: T.bg.card,
            borderRadius: 24,
            padding: 28,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: T.glass.border,
            alignItems: "center",
            ...Platform.select({
              ios: {
                shadowColor: T.accent.teal,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.3,
                shadowRadius: 24,
              },
              android: { elevation: 16 },
            }),
          }}
        >
          <WaterBottle percentage={percentage} size={200} />

          {/* Big Stat */}
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text
              style={{
                color: T.accent.teal,
                fontSize: 48,
                fontWeight: "900",
                letterSpacing: -2,
                fontVariant: ["tabular-nums"],
              }}
            >
              {totalWaterMl.toLocaleString()}
              <Text style={{ fontSize: 22, fontWeight: "600", color: T.text.muted }}> ml</Text>
            </Text>
            <Text
              style={{
                color: T.text.muted,
                fontSize: 15,
                fontWeight: "500",
                marginTop: 4,
              }}
            >
              of {goal.toLocaleString()} ml goal
            </Text>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              width: "100%",
              height: 10,
              backgroundColor: T.bg.elevated,
              borderRadius: 5,
              marginTop: 20,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${percentage}%`,
                height: "100%",
                backgroundColor: T.accent.teal,
                borderRadius: 5,
                ...Platform.select({
                  ios: {
                    shadowColor: T.accent.teal,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 8,
                  },
                  android: {},
                }),
              }}
            />
          </View>
          <Text
            style={{
              color: T.text.muted,
              fontSize: 13,
              fontWeight: "600",
              marginTop: 8,
            }}
          >
            {Math.round(percentage)}% complete
          </Text>
        </View>

        {/* Quick Add */}
        <Text style={S.sectionTitle}>Quick Add</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {quickAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              onPress={() => {
                addWater(amount);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                flex: 1,
                backgroundColor: T.bg.card,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(78, 205, 196, 0.15)",
                ...Platform.select({
                  ios: {
                    shadowColor: T.accent.teal,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                  },
                  android: { elevation: 6 },
                }),
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={18} color={T.accent.teal} style={{ marginBottom: 2 }} />
              <Text
                style={{
                  color: T.accent.teal,
                  fontSize: 15,
                  fontWeight: "700",
                  fontVariant: ["tabular-nums"],
                }}
              >
                {amount}ml
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setShowCustom(true)}
            style={{
              flex: 1,
              backgroundColor: "rgba(124, 111, 247, 0.12)",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(124, 111, 247, 0.2)",
              ...Platform.select({
                ios: {
                  shadowColor: T.accent.purple,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                },
                android: { elevation: 6 },
              }),
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color={T.accent.purple} style={{ marginBottom: 2 }} />
            <Text
              style={{
                color: T.accent.purple,
                fontSize: 15,
                fontWeight: "700",
              }}
            >
              Custom
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Chart */}
        <View style={S.glassCard()}>
          <WeeklyBarChart data={weeklyHydration} goal={goal} barColor={T.accent.teal} />
        </View>

        {/* Insight */}
        <InsightCard
          text="Staying hydrated helps maintain energy levels and supports cognitive function. Try drinking a glass of water when you wake up."
        />
      </View>

      {/* Custom Amount Modal */}
      <Modal visible={showCustom} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              backgroundColor: T.bg.card,
              borderRadius: 24,
              padding: 28,
              width: "100%",
              borderWidth: 1,
              borderColor: T.glass.border,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.5,
                  shadowRadius: 40,
                },
                android: { elevation: 20 },
              }),
            }}
          >
            <Text
              style={{
                color: T.text.primary,
                fontSize: 20,
                fontWeight: "800",
                marginBottom: 20,
              }}
            >
              Custom Amount
            </Text>
            <TextInput
              value={customAmount}
              onChangeText={setCustomAmount}
              placeholder="Enter ml"
              placeholderTextColor={T.text.muted}
              keyboardType="numeric"
              style={{
                backgroundColor: T.bg.elevated,
                borderRadius: 14,
                paddingHorizontal: 18,
                paddingVertical: 14,
                color: T.text.primary,
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 20,
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowCustom(false)}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: T.bg.elevated,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: T.glass.border,
                }}
              >
                <Text style={{ color: T.text.secondary, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCustomAdd}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: T.accent.teal,
                  alignItems: "center",
                  ...Platform.select({
                    ios: {
                      shadowColor: T.accent.teal,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                    },
                    android: { elevation: 8 },
                  }),
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
