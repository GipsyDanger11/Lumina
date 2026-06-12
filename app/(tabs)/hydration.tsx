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
    <ScrollView style={{ flex: 1, backgroundColor: "#0A0A0F" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 64, paddingHorizontal: 24 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", marginBottom: 24 }}>Hydration</Text>

        {/* Bottle */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <WaterBottle percentage={percentage} size={180} />
          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginTop: 16, fontVariant: ["tabular-nums"] }}>
            {(totalWaterMl / 1000).toFixed(1)}L
          </Text>
          <Text style={{ color: "#5A5A6E", fontSize: 14 }}>
            of {(goal / 1000).toFixed(1)}L goal · {Math.round(percentage)}%
          </Text>
        </View>

        {/* Quick Add */}
        <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Quick Add</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {[150, 250, 350, 500, 750].map((amount) => (
            <TouchableOpacity
              key={amount}
              onPress={() => { addWater(amount); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={{ backgroundColor: "#1A1A24", borderWidth: 1, borderColor: "rgba(78, 205, 196, 0.2)", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 }}
              activeOpacity={0.7}
            >
              <Text style={{ color: "#4ECDC4", fontSize: 14, fontWeight: "500" }}>{amount}ml</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setShowCustom(true)}
            style={{ backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 }}
            activeOpacity={0.7}
          >
            <Text style={{ color: "#7C6FF7", fontSize: 14, fontWeight: "500" }}>Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Chart */}
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <WeeklyBarChart data={weeklyHydration} goal={goal} />
        </View>

        {/* Insight */}
        <InsightCard
          text="Staying hydrated helps maintain energy levels and supports cognitive function. Try drinking a glass of water when you wake up."
        />
      </View>

      {/* Custom Amount Modal */}
      <Modal visible={showCustom} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, width: "100%" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
              Custom Amount (ml)
            </Text>
            <TextInput
              value={customAmount}
              onChangeText={setCustomAmount}
              placeholder="Enter amount"
              placeholderTextColor="#5A5A6E"
              keyboardType="numeric"
              style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "#FFFFFF", fontSize: 16, marginBottom: 16 }}
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowCustom(false)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#12121A", alignItems: "center" }}
              >
                <Text style={{ color: "#A0A0B0", fontWeight: "500" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCustomAdd}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#7C6FF7", alignItems: "center" }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
