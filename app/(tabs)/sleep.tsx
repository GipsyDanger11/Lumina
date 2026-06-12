import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHealth } from "../hooks/useHealth";
import { SleepQualities } from "../../constants";
import { InsightCard } from "../components/cards/InsightCard";
import { db, doc, setDoc, serverTimestamp, collection, getDocs } from "../lib/firebase";
import { useUserStore } from "../store/useUserStore";

export default function SleepScreen() {
  const { sleep } = useHealth();
  const user = useUserStore((s) => s.user);
  const isGuest = useUserStore((s) => s.isGuest);
  const [hours, setHours] = useState(sleep?.hours?.toString() || "");
  const [quality, setQuality] = useState(sleep?.quality || "");
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<Array<{ date: string; hours: number; quality: string }>>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const entries: Array<{ date: string; hours: number; quality: string }> = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];

      if (isGuest) {
        const raw = await AsyncStorage.getItem("guest_sleep");
        if (raw) {
          const data = JSON.parse(raw);
          if (data.date?.startsWith(key)) {
            entries.push({ date: key, hours: data.hours, quality: data.quality || "" });
          }
        }
      } else if (user?.uid) {
        try {
          const snap = await getDocs(collection(db, `users/${user.uid}/logs/sleep`));
          snap.docs.forEach((doc) => {
            if (doc.id === key) {
              const data = doc.data();
              entries.push({ date: key, hours: data.hours, quality: data.quality || "" });
            }
          });
        } catch {}
      }
    }
    setHistory(entries);
  };

  const avgHours = history.length > 0 ? (history.reduce((s, e) => s + e.hours, 0) / history.length).toFixed(1) : "--";

  const saveSleep = async () => {
    const h = parseFloat(hours);
    if (!h || !quality) return;

    if (isGuest) {
      await AsyncStorage.setItem("guest_sleep", JSON.stringify({ hours: h, quality, date: new Date().toISOString() }));
    } else if (user?.uid) {
      const today = new Date().toISOString().split("T")[0];
      const ref = doc(db, `users/${user.uid}/logs/sleep/${today}`);
      await setDoc(ref, { hours: h, quality, logged_at: serverTimestamp() }, { merge: true });
    }
    setSaved(true);
    loadHistory();
    setTimeout(() => setSaved(false), 2000);
  };

  const hoursNum = parseFloat(hours) || 0;

  return (
    <ScrollView className="flex-1 bg-lumina-bg-primary" showsVerticalScrollIndicator={false}>
      <View className="pt-16 px-6">
        <Text className="text-lumina-text-primary text-2xl font-bold mb-6">Sleep</Text>

        {/* Current Sleep */}
        <View className="bg-lumina-bg-card rounded-2xl p-6 mb-6">
          <View className="items-center">
            <Ionicons name="moon" size={48} color="#7C6FF7" />
            <Text
              className="text-lumina-text-primary text-5xl font-bold mt-4"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {sleep?.hours || "--"}
            </Text>
            <Text className="text-lumina-text-muted text-sm mt-1">hours last night</Text>
            {sleep?.quality && (
              <View className="mt-2 bg-lumina-accent-purple/20 rounded-full px-4 py-1">
                <Text className="text-lumina-accent-purple text-sm font-medium capitalize">
                  {sleep.quality}
                </Text>
              </View>
            )}
            <View className="flex-row gap-6 mt-4 pt-3 border-t border-lumina-bg-secondary w-full justify-center">
              <View className="items-center">
                <Text className="text-lumina-accent-purple text-sm font-bold">{avgHours}h</Text>
                <Text className="text-lumina-text-muted text-[10px]">7-day avg</Text>
              </View>
              <View className="items-center">
                <Text className="text-lumina-accent-purple text-sm font-bold">{history.length}</Text>
                <Text className="text-lumina-text-muted text-[10px]">days logged</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sleep History */}
        {history.length > 0 && (
          <View className="bg-lumina-bg-card rounded-2xl p-4 mb-6">
            <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Past 7 Days</Text>
            <View className="flex-row justify-between items-end h-24">
              {history.map((entry, i) => {
                const maxH = 10;
                const barH = Math.min((entry.hours / maxH) * 80, 80);
                const dayLabel = new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" });
                return (
                  <View key={i} className="items-center flex-1">
                    <View
                      className="w-6 rounded-lg"
                      style={{
                        height: barH,
                        backgroundColor: entry.quality === "poor" ? "#FF6B6B" : entry.quality === "okay" ? "#FFD93D" : entry.quality === "good" ? "#4ECDC4" : "#7C6FF7",
                        opacity: 0.8,
                      }}
                    />
                    <Text className="text-lumina-text-muted text-[10px] mt-1">{dayLabel}</Text>
                    <Text className="text-lumina-text-muted text-[10px]">{entry.hours}h</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Log Sleep */}
        <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Log Sleep</Text>
        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-6">
          <Text className="text-lumina-text-primary text-sm font-medium mb-3">Hours</Text>
          <View className="flex-row gap-2 mb-4 flex-wrap">
            {[5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10].map((h) => (
              <TouchableOpacity
                key={h}
                onPress={() => setHours(h.toString())}
                className={`px-4 py-2.5 rounded-xl border ${
                  hours === h.toString()
                    ? "bg-lumina-accent-purple/20 border-lumina-accent-purple"
                    : "bg-lumina-bg-secondary border-lumina-text-muted/20"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    hours === h.toString() ? "text-lumina-accent-purple" : "text-lumina-text-secondary"
                  }`}
                >
                  {h}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-lumina-text-primary text-sm font-medium mb-3">Quality</Text>
          <View className="flex-row gap-2 mb-4">
            {SleepQualities.map((q: any) => (
              <TouchableOpacity
                key={q.value}
                onPress={() => setQuality(q.value)}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  quality === q.value
                    ? "border-lumina-accent-purple"
                    : "bg-lumina-bg-card border-lumina-text-muted/20"
                }`}
                style={quality === q.value ? { backgroundColor: `${q.color}20` } : {}}
              >
                <Text
                  className={`text-xs font-medium ${
                    quality === q.value ? "text-lumina-text-primary" : "text-lumina-text-muted"
                  }`}
                >
                  {q.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={saveSleep}
            className={`py-3.5 rounded-xl items-center ${
              hours && quality ? "bg-lumina-accent-purple" : "bg-lumina-bg-secondary"
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-semibold ${
                hours && quality ? "text-white" : "text-lumina-text-muted"
              }`}
            >
              {saved ? "Saved!" : "Save Sleep Log"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Insight */}
        <InsightCard
          text="Most adults need 7-9 hours of sleep. Consistent bedtimes help regulate your circadian rhythm for better sleep quality."
        />
      </View>
    </ScrollView>
  );
}