import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useHealth } from "../hooks/useHealth";
import { WaterBottle } from "../components/ui/WaterBottle";
import { WeeklyBarChart } from "../components/charts/WeeklyBarChart";
import { InsightCard } from "../components/cards/InsightCard";
import { db, doc, setDoc, arrayUnion, increment, serverTimestamp } from "../lib/firebase";
import { useUserStore } from "../store/useUserStore";
import { useHealthStore } from "../store/useHealthStore";

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
      const { useGuestStore } = await import("../store/useGuestStore");
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

    if (!user?.uid) return;
    const today = new Date().toISOString().split("T")[0];
    const ref = doc(db, `users/${user.uid}/logs/hydration/${today}`);
    await setDoc(
      ref,
      {
        entries: arrayUnion({
          amount_ml: amount,
          beverage_type: "water",
          timestamp: new Date().toISOString(),
        }),
        total_ml: increment(amount),
        last_updated: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      addWater(amount);
      setCustomAmount("");
      setShowCustom(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-lumina-bg-primary" showsVerticalScrollIndicator={false}>
      <View className="pt-16 px-6">
        <Text className="text-lumina-text-primary text-2xl font-bold mb-6">Hydration</Text>

        {/* Bottle */}
        <View className="items-center mb-8">
          <WaterBottle percentage={percentage} size={180} />
          <Text className="text-lumina-text-primary text-3xl font-bold mt-4" style={{ fontVariant: ["tabular-nums"] }}>
            {(totalWaterMl / 1000).toFixed(1)}L
          </Text>
          <Text className="text-lumina-text-muted text-sm">
            of {(goal / 1000).toFixed(1)}L goal · {Math.round(percentage)}%
          </Text>
        </View>

        {/* Quick Add */}
        <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Quick Add</Text>
        <View className="flex-row gap-2 mb-6 flex-wrap">
          {[150, 250, 350, 500, 750].map((amount) => (
            <TouchableOpacity
              key={amount}
              onPress={() => { addWater(amount); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              className="bg-lumina-bg-card border border-lumina-accent-teal/20 rounded-xl px-5 py-3"
              activeOpacity={0.7}
            >
              <Text className="text-lumina-accent-teal text-sm font-medium">{amount}ml</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setShowCustom(true)}
            className="bg-lumina-accent-purple/20 rounded-xl px-5 py-3"
            activeOpacity={0.7}
          >
            <Text className="text-lumina-accent-purple text-sm font-medium">Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Chart */}
        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-6">
          <WeeklyBarChart data={weeklyHydration} goal={goal} />
        </View>

        {/* Insight */}
        <InsightCard
          text="Staying hydrated helps maintain energy levels and supports cognitive function. Try drinking a glass of water when you wake up."
        />
      </View>

      {/* Custom Amount Modal */}
      <Modal visible={showCustom} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-8">
          <View className="bg-lumina-bg-card rounded-2xl p-6 w-full">
            <Text className="text-lumina-text-primary text-lg font-bold mb-4">
              Custom Amount (ml)
            </Text>
            <TextInput
              value={customAmount}
              onChangeText={setCustomAmount}
              placeholder="Enter amount"
              placeholderTextColor="#5A5A6E"
              keyboardType="numeric"
              className="bg-lumina-bg-secondary rounded-xl px-4 py-3 text-lumina-text-primary text-base mb-4"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowCustom(false)}
                className="flex-1 py-3 rounded-xl bg-lumina-bg-secondary items-center"
              >
                <Text className="text-lumina-text-secondary font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCustomAdd}
                className="flex-1 py-3 rounded-xl bg-lumina-accent-purple items-center"
              >
                <Text className="text-white font-medium">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
