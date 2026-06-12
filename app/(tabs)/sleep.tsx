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
    <ScrollView style={{ flex: 1, backgroundColor: "#0A0A0F" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 64, paddingHorizontal: 24 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", marginBottom: 24 }}>Sleep</Text>

        {/* Current Sleep */}
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <View style={{ alignItems: "center" }}>
            <Ionicons name="moon" size={48} color="#7C6FF7" />
            <Text
              style={{ color: "#FFFFFF", fontSize: 48, fontWeight: "700", marginTop: 16, fontVariant: ["tabular-nums"] }}
            >
              {sleep?.hours || "--"}
            </Text>
            <Text style={{ color: "#5A5A6E", fontSize: 14, marginTop: 4 }}>hours last night</Text>
            {sleep?.quality && (
              <View style={{ marginTop: 8, backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 999, paddingHorizontal: 16, paddingVertical: 4 }}>
                <Text style={{ color: "#7C6FF7", fontSize: 14, fontWeight: "500", textTransform: "capitalize" }}>
                  {sleep.quality}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: "row", gap: 24, marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#12121A", width: "100%", justifyContent: "center" }}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#7C6FF7", fontSize: 14, fontWeight: "700" }}>{avgHours}h</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 10 }}>7-day avg</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#7C6FF7", fontSize: 14, fontWeight: "700" }}>{history.length}</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 10 }}>days logged</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sleep History */}
        {history.length > 0 && (
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 24 }}>
            <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Past 7 Days</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 96 }}>
              {history.map((entry, i) => {
                const maxH = 10;
                const barH = Math.min((entry.hours / maxH) * 80, 80);
                const dayLabel = new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" });
                return (
                  <View key={i} style={{ alignItems: "center", flex: 1 }}>
                    <View
                      style={{
                        width: 24,
                        borderRadius: 8,
                        height: barH,
                        backgroundColor: entry.quality === "poor" ? "#FF6B6B" : entry.quality === "okay" ? "#FFD93D" : entry.quality === "good" ? "#4ECDC4" : "#7C6FF7",
                        opacity: 0.8,
                      }}
                    />
                    <Text style={{ color: "#5A5A6E", fontSize: 10, marginTop: 4 }}>{dayLabel}</Text>
                    <Text style={{ color: "#5A5A6E", fontSize: 10 }}>{entry.hours}h</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Log Sleep */}
        <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Log Sleep</Text>
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "500", marginBottom: 12 }}>Hours</Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10].map((h) => (
              <TouchableOpacity
                key={h}
                onPress={() => setHours(h.toString())}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: hours === h.toString() ? "#7C6FF7" : "rgba(90, 90, 110, 0.2)",
                  backgroundColor: hours === h.toString() ? "rgba(124, 111, 247, 0.2)" : "#12121A",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: hours === h.toString() ? "#7C6FF7" : "#A0A0B0",
                  }}
                >
                  {h}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "500", marginBottom: 12 }}>Quality</Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
            {SleepQualities.map((q: any) => (
              <TouchableOpacity
                key={q.value}
                onPress={() => setQuality(q.value)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: quality === q.value ? "#7C6FF7" : "rgba(90, 90, 110, 0.2)",
                  alignItems: "center",
                  backgroundColor: quality === q.value ? `${q.color}20` : "#1A1A24",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: quality === q.value ? "#FFFFFF" : "#5A5A6E",
                  }}
                >
                  {q.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={saveSleep}
            style={{
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              backgroundColor: hours && quality ? "#7C6FF7" : "#12121A",
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: hours && quality ? "#FFFFFF" : "#5A5A6E",
              }}
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
