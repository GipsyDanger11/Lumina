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
      <ScrollView className="flex-1 bg-lumina-bg-primary" showsVerticalScrollIndicator={false}>
        <View className="pt-16 px-6 items-center justify-center" style={{ minHeight: 600 }}>
          <View className="w-20 h-20 bg-lumina-bg-card rounded-full items-center justify-center mb-6">
            <Ionicons name="person-outline" size={32} color="#5A5A6E" />
          </View>
          <Text className="text-lumina-text-primary text-xl font-bold mb-2">Guest Mode</Text>
          <Text className="text-lumina-text-secondary text-sm text-center mb-8">
            Sign in to sync your data, unlock voice mode, and get personalized insights.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="bg-lumina-accent-purple rounded-2xl py-4 px-8"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-lumina-bg-primary" showsVerticalScrollIndicator={false}>
      <View className="pt-16 px-6">
        <Text className="text-lumina-text-primary text-2xl font-bold mb-6">Profile</Text>

        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-lumina-accent-purple/20 rounded-full items-center justify-center mb-3">
            <Text className="text-lumina-accent-purple text-2xl font-bold">
              {profile?.name?.[0] || user?.email?.[0] || "?"}
            </Text>
          </View>
          <Text className="text-lumina-text-primary text-lg font-bold">{profile?.name || "User"}</Text>
          <Text className="text-lumina-text-muted text-sm">{user?.email}</Text>
        </View>

        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-4">
          <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Profile Info</Text>
          {[
            { label: "Age", value: profile?.age?.toString() || "-" },
            { label: "Gender", value: profile?.gender || "-" },
            { label: "Height", value: profile?.height || "-" },
            { label: "Weight", value: profile?.weight || "-" },
            { label: "Activity", value: profile?.activity_level || "-" },
          ].map((item) => (
            <View key={item.label} className="flex-row justify-between py-2 border-b border-lumina-bg-secondary">
              <Text className="text-lumina-text-muted text-sm">{item.label}</Text>
              <Text className="text-lumina-text-primary text-sm font-medium capitalize">{item.value}</Text>
            </View>
          ))}
        </View>

        {profile?.goals && profile.goals.length > 0 && (
          <View className="bg-lumina-bg-card rounded-2xl p-4 mb-4">
            <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Health Goals</Text>
            <View className="flex-row flex-wrap gap-2">
              {profile.goals.map((goal: string) => (
                <View key={goal} className="bg-lumina-accent-purple/20 rounded-full px-3 py-1.5">
                  <Text className="text-lumina-accent-purple text-xs font-medium">{goal}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="bg-lumina-bg-card rounded-2xl mb-4">
          {[
            { label: "Edit Profile", icon: "person-outline" as const, key: "edit" as SettingModal },
            { label: "Notifications", icon: "notifications-outline" as const, key: "notifications" as SettingModal },
            { label: "Units", icon: "speedometer-outline" as const, key: "units" as SettingModal },
            { label: "Goals", icon: "flag" as const, key: "goals" as SettingModal },
          ].map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => setActiveModal(item.key)}
              className={`flex-row items-center justify-between px-4 py-3.5 ${
                i < 3 ? "border-b border-lumina-bg-secondary" : ""
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name={item.icon} size={18} color="#A0A0B0" />
                <Text className="text-lumina-text-primary text-sm">{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#5A5A6E" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-lumina-accent-coral/10 rounded-2xl py-4 items-center mb-8"
          activeOpacity={0.7}
        >
          <Text className="text-lumina-accent-coral text-sm font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={activeModal === "edit"} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-8">
          <View className="bg-lumina-bg-card rounded-2xl p-6 w-full">
            <Text className="text-lumina-text-primary text-lg font-bold mb-4">Edit Profile</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
              placeholderTextColor="#5A5A6E"
              className="bg-lumina-bg-secondary rounded-xl px-4 py-3 text-lumina-text-primary text-base mb-3"
            />
            <TextInput
              value={editAge}
              onChangeText={setEditAge}
              placeholder="Age"
              placeholderTextColor="#5A5A6E"
              keyboardType="numeric"
              className="bg-lumina-bg-secondary rounded-xl px-4 py-3 text-lumina-text-primary text-base mb-4"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setActiveModal(null)} className="flex-1 py-3 rounded-xl bg-lumina-bg-secondary items-center">
                <Text className="text-lumina-text-secondary font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveProfile} className="flex-1 py-3 rounded-xl bg-lumina-accent-purple items-center">
                <Text className="text-white font-medium">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={activeModal === "notifications"} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-8">
          <View className="bg-lumina-bg-card rounded-2xl p-6 w-full">
            <Text className="text-lumina-text-primary text-lg font-bold mb-4">Notifications</Text>
            {[
              { label: "Hydration Reminders", value: notifHydration, set: setNotifHydration },
              { label: "Sleep Reminders", value: notifSleep, set: setNotifSleep },
              { label: "Habit Reminders", value: notifHabits, set: setNotifHabits },
              { label: "Daily Insights", value: notifInsights, set: setNotifInsights },
            ].map((item) => (
              <View key={item.label} className="flex-row items-center justify-between py-3 border-b border-lumina-bg-secondary">
                <Text className="text-lumina-text-primary text-sm">{item.label}</Text>
                <Switch value={item.value} onValueChange={item.set} trackColor={{ false: "#1A1A24", true: "#7C6FF780" }} thumbColor={item.value ? "#7C6FF7" : "#5A5A6E"} />
              </View>
            ))}
            <TouchableOpacity onPress={() => setActiveModal(null)} className="mt-4 py-3 rounded-xl bg-lumina-accent-purple items-center">
              <Text className="text-white font-medium">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Units Modal */}
      <Modal visible={activeModal === "units"} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-8">
          <View className="bg-lumina-bg-card rounded-2xl p-6 w-full">
            <Text className="text-lumina-text-primary text-lg font-bold mb-4">Measurement Units</Text>
            {[
              { label: "Metric (kg, cm)", value: true },
              { label: "Imperial (lbs, ft)", value: false },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => setMetricUnit(item.value)}
                className={`flex-row items-center justify-between py-3 px-4 rounded-xl mb-2 ${metricUnit === item.value ? "bg-lumina-accent-purple/20" : "bg-lumina-bg-secondary"}`}
              >
                <Text className={`text-sm ${metricUnit === item.value ? "text-lumina-accent-purple font-semibold" : "text-lumina-text-primary"}`}>{item.label}</Text>
                {metricUnit === item.value && <Ionicons name="checkmark-circle" size={20} color="#7C6FF7" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setActiveModal(null)} className="mt-4 py-3 rounded-xl bg-lumina-accent-purple items-center">
              <Text className="text-white font-medium">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Goals Modal */}
      <Modal visible={activeModal === "goals"} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-8">
          <View className="bg-lumina-bg-card rounded-2xl p-6 w-full">
            <Text className="text-lumina-text-primary text-lg font-bold mb-4">Health Goals</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {HealthGoals.map((goal: any) => {
                const selected = selectedGoals.includes(goal);
                return (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => setSelectedGoals(selected ? selectedGoals.filter((g) => g !== goal) : [...selectedGoals, goal])}
                    className={`rounded-full px-4 py-2 ${selected ? "bg-lumina-accent-purple" : "bg-lumina-bg-secondary"}`}
                  >
                    <Text className={`text-xs font-medium ${selected ? "text-white" : "text-lumina-text-secondary"}`}>{goal}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setActiveModal(null)} className="flex-1 py-3 rounded-xl bg-lumina-bg-secondary items-center">
                <Text className="text-lumina-text-secondary font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveGoals} className="flex-1 py-3 rounded-xl bg-lumina-accent-purple items-center">
                <Text className="text-white font-medium">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}