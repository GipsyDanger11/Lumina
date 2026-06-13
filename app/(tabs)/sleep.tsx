import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHealth } from "../hooks/useHealth";
import { SleepQualities } from "../../constants";
import { InsightCard } from "../components/cards/InsightCard";
import { db, doc, setDoc, serverTimestamp, collection, getDocs } from "../lib/firebase";
import { useUserStore } from "../store/useUserStore";
import { T, S } from "../lib/theme";

const qualityColorMap: Record<string, string> = {
  poor: T.accent.coral,
  okay: T.accent.gold,
  good: T.accent.teal,
  great: T.accent.purple,
};

const qualityGradientMap: Record<string, readonly [string, string]> = {
  poor: T.gradient.coral,
  okay: T.gradient.gold,
  good: T.gradient.teal,
  great: T.gradient.purple,
};

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

  const avgHours =
    history.length > 0
      ? (history.reduce((s, e) => s + e.hours, 0) / history.length).toFixed(1)
      : "--";

  const saveSleep = async () => {
    const h = parseFloat(hours);
    if (!h || !quality) return;

    if (isGuest) {
      await AsyncStorage.setItem(
        "guest_sleep",
        JSON.stringify({ hours: h, quality, date: new Date().toISOString() })
      );
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
          Sleep
        </Text>

        {/* Current Sleep Hero Card */}
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
                shadowColor: T.accent.purple,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.3,
                shadowRadius: 24,
              },
              android: { elevation: 16 },
            }),
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "rgba(124, 111, 247, 0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="moon" size={36} color={T.accent.purple} />
          </View>

          <Text
            style={{
              color: T.text.primary,
              fontSize: 52,
              fontWeight: "900",
              letterSpacing: -2,
              fontVariant: ["tabular-nums"],
            }}
          >
            {sleep?.hours || "--"}
            <Text style={{ fontSize: 24, fontWeight: "600", color: T.text.muted }}> hrs</Text>
          </Text>
          <Text
            style={{
              color: T.text.muted,
              fontSize: 15,
              fontWeight: "500",
              marginTop: 4,
            }}
          >
            last night
          </Text>

          {sleep?.quality && (
            <View
              style={{
                marginTop: 12,
                backgroundColor: `${qualityColorMap[sleep.quality] || T.accent.purple}20`,
                borderRadius: 999,
                paddingHorizontal: 20,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: `${qualityColorMap[sleep.quality] || T.accent.purple}30`,
              }}
            >
              <Text
                style={{
                  color: qualityColorMap[sleep.quality] || T.accent.purple,
                  fontSize: 14,
                  fontWeight: "700",
                  textTransform: "capitalize",
                }}
              >
                {sleep.quality}
              </Text>
            </View>
          )}

          {/* Stats Row */}
          <View
            style={{
              flexDirection: "row",
              gap: 32,
              marginTop: 20,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: T.glass.border,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: T.accent.purple,
                  fontSize: 20,
                  fontWeight: "800",
                  fontVariant: ["tabular-nums"],
                }}
              >
                {avgHours}h
              </Text>
              <Text style={{ color: T.text.muted, fontSize: 11, fontWeight: "600", marginTop: 2 }}>
                7-day avg
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: T.accent.purple,
                  fontSize: 20,
                  fontWeight: "800",
                  fontVariant: ["tabular-nums"],
                }}
              >
                {history.length}
              </Text>
              <Text style={{ color: T.text.muted, fontSize: 11, fontWeight: "600", marginTop: 2 }}>
                days logged
              </Text>
            </View>
          </View>
        </View>

        {/* 7-Day History */}
        {history.length > 0 && (
          <View style={S.glassCard()}>
            <Text style={S.sectionTitle}>Past 7 Days</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                height: 110,
                paddingTop: 8,
              }}
            >
              {history.map((entry, i) => {
                const maxH = 10;
                const barH = Math.min((entry.hours / maxH) * 85, 85);
                const dayLabel = new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" });
                const barColor = qualityColorMap[entry.quality] || T.text.muted;
                return (
                  <View key={i} style={{ alignItems: "center", flex: 1 }}>
                    <View
                      style={{
                        width: 28,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                        height: barH,
                        backgroundColor: barColor,
                        opacity: 0.85,
                        ...Platform.select({
                          ios: {
                            shadowColor: barColor,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 6,
                          },
                          android: { elevation: 4 },
                        }),
                      }}
                    />
                    <Text
                      style={{
                        color: T.text.muted,
                        fontSize: 10,
                        fontWeight: "600",
                        marginTop: 6,
                      }}
                    >
                      {dayLabel}
                    </Text>
                    <Text
                      style={{
                        color: T.text.muted,
                        fontSize: 10,
                        fontWeight: "600",
                        fontVariant: ["tabular-nums"],
                      }}
                    >
                      {entry.hours}h
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Quality Selector */}
        <Text style={S.sectionTitle}>Sleep Quality</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {SleepQualities.map((q: any) => {
            const isActive = quality === q.value;
            const colors = qualityGradientMap[q.value];
            return (
              <TouchableOpacity
                key={q.value}
                onPress={() => setQuality(q.value)}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: "center",
                  backgroundColor: isActive ? q.color : T.bg.card,
                  borderWidth: 1,
                  borderColor: isActive ? q.color : T.glass.border,
                  ...Platform.select({
                    ios: {
                      shadowColor: isActive ? q.color : "transparent",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isActive ? 0.35 : 0,
                      shadowRadius: isActive ? 12 : 0,
                    },
                    android: { elevation: isActive ? 8 : 0 },
                  }),
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: isActive ? "#FFFFFF" : T.text.muted,
                    textTransform: "capitalize",
                  }}
                >
                  {q.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Hours Input */}
        <Text style={S.sectionTitle}>Hours Slept</Text>
        <View
          style={{
            backgroundColor: T.bg.card,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: T.glass.border,
          }}
        >
          {/* +/- Buttons */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                const current = parseFloat(hours) || 0;
                const next = Math.max(0, current - 0.5);
                setHours(next.toString());
              }}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: T.bg.elevated,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={24} color={T.text.secondary} />
            </TouchableOpacity>

            <View style={{ alignItems: "center", minWidth: 100 }}>
              <Text
                style={{
                  color: T.text.primary,
                  fontSize: 48,
                  fontWeight: "900",
                  letterSpacing: -2,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {hours || "0"}
              </Text>
              <Text style={{ color: T.text.muted, fontSize: 13, fontWeight: "600" }}>hours</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                const current = parseFloat(hours) || 0;
                const next = Math.min(14, current + 0.5);
                setHours(next.toString());
              }}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: T.bg.elevated,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color={T.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Quick Presets */}
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            {[5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10].map((h) => (
              <TouchableOpacity
                key={h}
                onPress={() => setHours(h.toString())}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: hours === h.toString() ? T.accent.purple : T.glass.border,
                  backgroundColor: hours === h.toString() ? "rgba(124, 111, 247, 0.15)" : T.bg.elevated,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: hours === h.toString() ? T.accent.purple : T.text.muted,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {h}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={saveSleep}
          style={{
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            backgroundColor: hours && quality ? T.accent.purple : T.bg.elevated,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: hours && quality ? T.accent.purple : T.glass.border,
            ...Platform.select({
              ios: {
                shadowColor: hours && quality ? T.accent.purple : "transparent",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: hours && quality ? 0.4 : 0,
                shadowRadius: hours && quality ? 16 : 0,
              },
              android: { elevation: hours && quality ? 10 : 0 },
            }),
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: hours && quality ? "#FFFFFF" : T.text.muted,
            }}
          >
            {saved ? "Saved!" : "Save Sleep Log"}
          </Text>
        </TouchableOpacity>

        {/* Insight */}
        <InsightCard
          text="Most adults need 7-9 hours of sleep. Consistent bedtimes help regulate your circadian rhythm for better sleep quality."
        />
      </View>
    </ScrollView>
  );
}
