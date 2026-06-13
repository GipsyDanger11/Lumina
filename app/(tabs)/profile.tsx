import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import { useHealthStore } from "../../store/useHealthStore";
import { auth, signOut, db, doc, setDoc, serverTimestamp } from "../../lib/firebase";
import { ActivityLevels, HealthGoals } from "../../constants";
import { T, S } from "../../lib/theme";

type SettingModal = "edit" | "notifications" | "units" | "goals" | null;

export default function ProfileScreen() {
  const { user, profile, isGuest, clearUser } = useUserStore();
  const { streakDays, todayHabits, todayTotalMl } = useHealthStore();
  const [activeModal, setActiveModal] = useState<SettingModal>(null);
  const [editName, setEditName] = useState(profile?.name || "");
  const [editAge, setEditAge] = useState(profile?.age?.toString() || "");
  const [metricUnit, setMetricUnit] = useState(true);
  const [notifHydration, setNotifHydration] = useState(true);
  const [notifSleep, setNotifSleep] = useState(true);
  const [notifHabits, setNotifHabits] = useState(true);
  const [notifInsights, setNotifInsights] = useState(true);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(profile?.goals || []);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          clearUser();
          router.replace("/(guest)");
        },
      },
    ]);
  };

  const saveProfile = async () => {
    if (!user?.uid) return;
    const ref = doc(db, `users/${user.uid}/profile/main`);
    await setDoc(
      ref,
      {
        name: editName || profile?.name,
        age: parseInt(editAge) || profile?.age,
        updated_at: serverTimestamp(),
      },
      { merge: true }
    );
    useUserStore
      .getState()
      .setProfile({
        ...profile,
        name: editName || profile?.name,
        age: parseInt(editAge) || profile?.age,
      } as any);
    setActiveModal(null);
  };

  const saveGoals = async () => {
    if (!user?.uid) return;
    const ref = doc(db, `users/${user.uid}/profile/main`);
    await setDoc(ref, { goals: selectedGoals, updated_at: serverTimestamp() }, { merge: true });
    useUserStore.getState().setProfile({ ...profile, goals: selectedGoals } as any);
    setActiveModal(null);
  };

  if (isGuest) {
    return (
      <ScrollView style={S.screen} showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingTop: 64,
            paddingHorizontal: 24,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 600,
          }}
        >
          <View
            style={{
              width: 96,
              height: 96,
              backgroundColor: T.bg.cardLight,
              borderRadius: 48,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              borderWidth: 1,
              borderColor: T.glass.border,
            }}
          >
            <Ionicons name="person-outline" size={36} color={T.text.muted} />
          </View>
          <Text style={{ color: T.text.primary, fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
            Guest Mode
          </Text>
          <Text
            style={{
              color: T.text.secondary,
              fontSize: 14,
              textAlign: "center",
              marginBottom: 32,
              lineHeight: 20,
              paddingHorizontal: 16,
            }}
          >
            Sign in to sync your data, unlock voice mode, and get personalized insights.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[...T.gradient.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 40,
                ...Platform.select({
                  ios: {
                    shadowColor: T.accent.purple,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                  },
                  android: { elevation: 8 },
                }),
              }}
            >
              <Text style={{ color: T.text.primary, fontSize: 16, fontWeight: "600" }}>
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={S.screen} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 64, paddingHorizontal: 24 }}>
        <Text style={{ color: T.text.primary, fontSize: 26, fontWeight: "800", marginBottom: 28 }}>
          Profile
        </Text>

        {/* Profile Header */}
        <View style={{ alignItems: "center", marginBottom: 28 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
              ...Platform.select({
                ios: {
                  shadowColor: T.accent.purple,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                },
                android: { elevation: 8 },
              }),
            }}
          >
            <LinearGradient
              colors={[...T.gradient.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "800" }}>
                {profile?.name?.[0] || user?.email?.[0] || "?"}
              </Text>
            </LinearGradient>
          </View>
          <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "700", marginBottom: 4 }}>
            {profile?.name || "User"}
          </Text>
          <Text style={{ color: T.text.muted, fontSize: 14 }}>{user?.email}</Text>
        </View>

        {/* Stats Row */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Streak",
              value: `${streakDays}`,
              unit: "days",
              color: T.accent.coral,
              gradient: T.gradient.coral,
              icon: "flame-outline" as const,
            },
            {
              label: "Habits",
              value: `${todayHabits.length}`,
              unit: "today",
              color: T.accent.teal,
              gradient: T.gradient.teal,
              icon: "checkmark-circle-outline" as const,
            },
            {
              label: "Water",
              value: todayTotalMl >= 1000 ? `${(todayTotalMl / 1000).toFixed(1)}` : `${todayTotalMl}`,
              unit: todayTotalMl >= 1000 ? "L" : "ml",
              color: T.accent.blue,
              gradient: T.gradient.blue,
              icon: "water-outline" as const,
            },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: T.glass.bg,
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: T.glass.border,
                alignItems: "center",
                ...Platform.select({
                  ios: {
                    shadowColor: stat.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                  },
                  android: { elevation: 6 },
                }),
              }}
            >
              <Ionicons name={stat.icon} size={20} color={stat.color} style={{ marginBottom: 6 }} />
              <Text style={S.statNumber(stat.color)}>{stat.value}</Text>
              <Text style={{ color: T.text.muted, fontSize: 11, fontWeight: "500", marginTop: 2 }}>
                {stat.unit}
              </Text>
            </View>
          ))}
        </View>

        {/* Profile Info */}
        <View style={S.glassCard()}>
          <Text style={S.sectionTitle}>Profile Info</Text>
          {[
            { label: "Age", value: profile?.age?.toString() || "-" },
            { label: "Gender", value: profile?.gender || "-" },
            { label: "Height", value: profile?.height || "-" },
            { label: "Weight", value: profile?.weight || "-" },
            { label: "Activity", value: profile?.activity_level || "-" },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.04)",
              }}
            >
              <Text style={{ color: T.text.muted, fontSize: 14 }}>{item.label}</Text>
              <Text
                style={{
                  color: T.text.primary,
                  fontSize: 14,
                  fontWeight: "500",
                  textTransform: "capitalize",
                }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Health Goals */}
        {profile?.goals && profile.goals.length > 0 && (
          <View style={S.glassCard()}>
            <Text style={S.sectionTitle}>Health Goals</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {profile.goals.map((goal: string) => (
                <View
                  key={goal}
                  style={{
                    backgroundColor: "rgba(124, 111, 247, 0.15)",
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderWidth: 1,
                    borderColor: "rgba(124, 111, 247, 0.2)",
                  }}
                >
                  <Text style={{ color: T.accent.purpleLight, fontSize: 12, fontWeight: "600" }}>
                    {goal}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={S.glassCard({ marginBottom: 16 })}>
          {[
            { label: "Edit Profile", icon: "person-outline" as const, key: "edit" as SettingModal },
            {
              label: "Notifications",
              icon: "notifications-outline" as const,
              key: "notifications" as SettingModal,
            },
            {
              label: "Units",
              icon: "speedometer-outline" as const,
              key: "units" as SettingModal,
            },
            { label: "Goals", icon: "flag" as const, key: "goals" as SettingModal },
          ].map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => setActiveModal(item.key)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 15,
                borderBottomWidth: i < 3 ? 1 : 0,
                borderBottomColor: "rgba(255,255,255,0.04)",
              }}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: "rgba(124, 111, 247, 0.12)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={item.icon} size={17} color={T.accent.purpleLight} />
                </View>
                <Text style={{ color: T.text.primary, fontSize: 15, fontWeight: "500" }}>
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={T.text.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["rgba(255, 107, 107, 0.12)", "rgba(255, 107, 107, 0.06)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 32,
              borderWidth: 1,
              borderColor: "rgba(255, 107, 107, 0.15)",
            }}
          >
            <Text style={{ color: T.accent.coral, fontSize: 15, fontWeight: "600" }}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={activeModal === "edit"} transparent animationType="fade">
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
              borderRadius: 20,
              padding: 28,
              width: "100%",
              borderWidth: 1,
              borderColor: T.glass.border,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.5,
                  shadowRadius: 24,
                },
                android: { elevation: 16 },
              }),
            }}
          >
            <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
              Edit Profile
            </Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
              placeholderTextColor={T.text.muted}
              style={{
                backgroundColor: T.bg.primary,
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 13,
                color: T.text.primary,
                fontSize: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
            />
            <TextInput
              value={editAge}
              onChangeText={setEditAge}
              placeholder="Age"
              placeholderTextColor={T.text.muted}
              keyboardType="numeric"
              style={{
                backgroundColor: T.bg.primary,
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 13,
                color: T.text.primary,
                fontSize: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setActiveModal(null)}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 14,
                  backgroundColor: T.bg.primary,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: T.glass.border,
                }}
              >
                <Text style={{ color: T.text.secondary, fontWeight: "500" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveProfile}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 14,
                  backgroundColor: T.accent.purple,
                  alignItems: "center",
                  ...Platform.select({
                    ios: {
                      shadowColor: T.accent.purple,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                    },
                    android: { elevation: 6 },
                  }),
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "600" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={activeModal === "notifications"} transparent animationType="fade">
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
              borderRadius: 20,
              padding: 28,
              width: "100%",
              borderWidth: 1,
              borderColor: T.glass.border,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.5,
                  shadowRadius: 24,
                },
                android: { elevation: 16 },
              }),
            }}
          >
            <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
              Notifications
            </Text>
            {[
              { label: "Hydration Reminders", value: notifHydration, set: setNotifHydration },
              { label: "Sleep Reminders", value: notifSleep, set: setNotifSleep },
              { label: "Habit Reminders", value: notifHabits, set: setNotifHabits },
              { label: "Daily Insights", value: notifInsights, set: setNotifInsights },
            ].map((item) => (
              <View
                key={item.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255,255,255,0.04)",
                }}
              >
                <Text style={{ color: T.text.primary, fontSize: 15 }}>{item.label}</Text>
                <Switch
                  value={item.value}
                  onValueChange={item.set}
                  trackColor={{ false: "#2A2A4A", true: "rgba(124, 111, 247, 0.5)" }}
                  thumbColor={item.value ? T.accent.purple : T.text.muted}
                />
              </View>
            ))}
            <TouchableOpacity
              onPress={() => setActiveModal(null)}
              style={{
                marginTop: 20,
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: T.accent.purple,
                alignItems: "center",
                ...Platform.select({
                  ios: {
                    shadowColor: T.accent.purple,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                  },
                  android: { elevation: 6 },
                }),
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "600" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Units Modal */}
      <Modal visible={activeModal === "units"} transparent animationType="fade">
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
              borderRadius: 20,
              padding: 28,
              width: "100%",
              borderWidth: 1,
              borderColor: T.glass.border,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.5,
                  shadowRadius: 24,
                },
                android: { elevation: 16 },
              }),
            }}
          >
            <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
              Measurement Units
            </Text>
            {[
              { label: "Metric (kg, cm)", value: true },
              { label: "Imperial (lbs, ft)", value: false },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => setMetricUnit(item.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 14,
                  marginBottom: 10,
                  backgroundColor:
                    metricUnit === item.value ? "rgba(124, 111, 247, 0.15)" : T.bg.primary,
                  borderWidth: 1,
                  borderColor:
                    metricUnit === item.value ? "rgba(124, 111, 247, 0.3)" : T.glass.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: metricUnit === item.value ? T.accent.purpleLight : T.text.primary,
                    fontWeight: metricUnit === item.value ? "600" : "400",
                  }}
                >
                  {item.label}
                </Text>
                {metricUnit === item.value && (
                  <Ionicons name="checkmark-circle" size={22} color={T.accent.purple} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setActiveModal(null)}
              style={{
                marginTop: 16,
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: T.accent.purple,
                alignItems: "center",
                ...Platform.select({
                  ios: {
                    shadowColor: T.accent.purple,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                  },
                  android: { elevation: 6 },
                }),
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "600" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Goals Modal */}
      <Modal visible={activeModal === "goals"} transparent animationType="fade">
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
              borderRadius: 20,
              padding: 28,
              width: "100%",
              borderWidth: 1,
              borderColor: T.glass.border,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.5,
                  shadowRadius: 24,
                },
                android: { elevation: 16 },
              }),
            }}
          >
            <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
              Health Goals
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {HealthGoals.map((goal: any) => {
                const selected = selectedGoals.includes(goal);
                return (
                  <TouchableOpacity
                    key={goal}
                    onPress={() =>
                      setSelectedGoals(
                        selected
                          ? selectedGoals.filter((g) => g !== goal)
                          : [...selectedGoals, goal]
                      )
                    }
                    style={{
                      borderRadius: 999,
                      paddingHorizontal: 18,
                      paddingVertical: 10,
                      backgroundColor: selected ? T.accent.purple : T.bg.primary,
                      borderWidth: 1,
                      borderColor: selected ? T.accent.purple : T.glass.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        color: selected ? "#FFF" : T.text.secondary,
                      }}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setActiveModal(null)}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 14,
                  backgroundColor: T.bg.primary,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: T.glass.border,
                }}
              >
                <Text style={{ color: T.text.secondary, fontWeight: "500" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveGoals}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 14,
                  backgroundColor: T.accent.purple,
                  alignItems: "center",
                  ...Platform.select({
                    ios: {
                      shadowColor: T.accent.purple,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                    },
                    android: { elevation: 6 },
                  }),
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "600" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
