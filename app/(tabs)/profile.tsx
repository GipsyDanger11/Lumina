import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import { auth, signOut, db, doc, setDoc, serverTimestamp } from "../lib/firebase";
import { ActivityLevels, HealthGoals } from "../../constants";

type SettingModal = "edit" | "notifications" | "units" | "goals" | null;

export default function ProfileScreen() {
  const { user, profile, isGuest, clearUser } = useUserStore();
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
    await setDoc(ref, {
      name: editName || profile?.name,
      age: parseInt(editAge) || profile?.age,
      updated_at: serverTimestamp(),
    }, { merge: true });
    useUserStore.getState().setProfile({ ...profile, name: editName || profile?.name, age: parseInt(editAge) || profile?.age } as any);
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
      <ScrollView style={{ flex: 1, backgroundColor: "#0A0A0F" }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: 64, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", minHeight: 600 }}>
          <View style={{ width: 80, height: 80, backgroundColor: "#1A1A24", borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <Ionicons name="person-outline" size={32} color="#5A5A6E" />
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginBottom: 8 }}>Guest Mode</Text>
          <Text style={{ color: "#A0A0B0", fontSize: 14, textAlign: "center", marginBottom: 32 }}>
            Sign in to sync your data, unlock voice mode, and get personalized insights.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={{ backgroundColor: "#7C6FF7", borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32 }}
            activeOpacity={0.8}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0A0A0F" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 64, paddingHorizontal: 24 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", marginBottom: 24 }}>Profile</Text>

        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{ width: 80, height: 80, backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Text style={{ color: "#7C6FF7", fontSize: 24, fontWeight: "700" }}>
              {profile?.name?.[0] || user?.email?.[0] || "?"}
            </Text>
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>{profile?.name || "User"}</Text>
          <Text style={{ color: "#5A5A6E", fontSize: 14 }}>{user?.email}</Text>
        </View>

        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Profile Info</Text>
          {[
            { label: "Age", value: profile?.age?.toString() || "-" },
            { label: "Gender", value: profile?.gender || "-" },
            { label: "Height", value: profile?.height || "-" },
            { label: "Weight", value: profile?.weight || "-" },
            { label: "Activity", value: profile?.activity_level || "-" },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#12121A" }}>
              <Text style={{ color: "#5A5A6E", fontSize: 14 }}>{item.label}</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "500", textTransform: "capitalize" }}>{item.value}</Text>
            </View>
          ))}
        </View>

        {profile?.goals && profile.goals.length > 0 && (
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Health Goals</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {profile.goals.map((goal: string) => (
                <View key={goal} style={{ backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ color: "#7C6FF7", fontSize: 12, fontWeight: "500" }}>{goal}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, marginBottom: 16 }}>
          {[
            { label: "Edit Profile", icon: "person-outline" as const, key: "edit" as SettingModal },
            { label: "Notifications", icon: "notifications-outline" as const, key: "notifications" as SettingModal },
            { label: "Units", icon: "speedometer-outline" as const, key: "units" as SettingModal },
            { label: "Goals", icon: "flag" as const, key: "goals" as SettingModal },
          ].map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => setActiveModal(item.key)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: i < 3 ? 1 : 0,
                borderBottomColor: "#12121A",
              }}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Ionicons name={item.icon} size={18} color="#A0A0B0" />
                <Text style={{ color: "#FFFFFF", fontSize: 14 }}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#5A5A6E" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          style={{ backgroundColor: "rgba(255, 107, 107, 0.1)", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginBottom: 32 }}
          activeOpacity={0.7}
        >
          <Text style={{ color: "#FF6B6B", fontSize: 14, fontWeight: "600" }}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={activeModal === "edit"} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, width: "100%" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 }}>Edit Profile</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
              placeholderTextColor="#5A5A6E"
              style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "#FFFFFF", fontSize: 16, marginBottom: 12 }}
            />
            <TextInput
              value={editAge}
              onChangeText={setEditAge}
              placeholder="Age"
              placeholderTextColor="#5A5A6E"
              keyboardType="numeric"
              style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "#FFFFFF", fontSize: 16, marginBottom: 16 }}
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#12121A", alignItems: "center" }}>
                <Text style={{ color: "#A0A0B0", fontWeight: "500" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveProfile} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#7C6FF7", alignItems: "center" }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={activeModal === "notifications"} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, width: "100%" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 }}>Notifications</Text>
            {[
              { label: "Hydration Reminders", value: notifHydration, set: setNotifHydration },
              { label: "Sleep Reminders", value: notifSleep, set: setNotifSleep },
              { label: "Habit Reminders", value: notifHabits, set: setNotifHabits },
              { label: "Daily Insights", value: notifInsights, set: setNotifInsights },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#12121A" }}>
                <Text style={{ color: "#FFFFFF", fontSize: 14 }}>{item.label}</Text>
                <Switch value={item.value} onValueChange={item.set} trackColor={{ false: "#1A1A24", true: "#7C6FF780" }} thumbColor={item.value ? "#7C6FF7" : "#5A5A6E"} />
              </View>
            ))}
            <TouchableOpacity onPress={() => setActiveModal(null)} style={{ marginTop: 16, paddingVertical: 12, borderRadius: 12, backgroundColor: "#7C6FF7", alignItems: "center" }}>
              <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Units Modal */}
      <Modal visible={activeModal === "units"} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, width: "100%" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 }}>Measurement Units</Text>
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
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  marginBottom: 8,
                  backgroundColor: metricUnit === item.value ? "rgba(124, 111, 247, 0.2)" : "#12121A",
                }}
              >
                <Text style={{ fontSize: 14, color: metricUnit === item.value ? "#7C6FF7" : "#FFFFFF", fontWeight: metricUnit === item.value ? "600" : "400" }}>{item.label}</Text>
                {metricUnit === item.value && <Ionicons name="checkmark-circle" size={20} color="#7C6FF7" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setActiveModal(null)} style={{ marginTop: 16, paddingVertical: 12, borderRadius: 12, backgroundColor: "#7C6FF7", alignItems: "center" }}>
              <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Goals Modal */}
      <Modal visible={activeModal === "goals"} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, width: "100%" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 }}>Health Goals</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {HealthGoals.map((goal: any) => {
                const selected = selectedGoals.includes(goal);
                return (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => setSelectedGoals(selected ? selectedGoals.filter((g) => g !== goal) : [...selectedGoals, goal])}
                    style={{
                      borderRadius: 999,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: selected ? "#7C6FF7" : "#12121A",
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "500", color: selected ? "#FFFFFF" : "#A0A0B0" }}>{goal}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#12121A", alignItems: "center" }}>
                <Text style={{ color: "#A0A0B0", fontWeight: "500" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveGoals} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#7C6FF7", alignItems: "center" }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
