import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useHealth } from "../hooks/useHealth";
import { Heatmap } from "../components/charts/Heatmap";
import { db, doc, setDoc, collection, addDoc, serverTimestamp, deleteDoc, updateDoc } from "../lib/firebase";
import { useUserStore } from "../store/useUserStore";
import { HabitIcons } from "../../constants";

export default function HabitsScreen() {
  const { habits, habitLogs } = useHealth();
  const user = useUserStore((s) => s.user);
  const isGuest = useUserStore((s) => s.isGuest);
  const [showCreate, setShowCreate] = useState(false);
  const [showAction, setShowAction] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editHabit, setEditHabit] = useState<any>(null);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitIcon, setNewHabitIcon] = useState("check");
  const [newHabitTime, setNewHabitTime] = useState("anytime");
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("check");
  const [editTime, setEditTime] = useState("anytime");

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = habitLogs || {};

  const toggleHabit = async (habitId: string, completed: boolean) => {
    if (isGuest) {
      const { useGuestStore } = await import("../store/useGuestStore");
      useGuestStore.getState().completeGuestHabit(habitId, completed ? "completed" : "pending");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    if (!user?.uid) return;
    const ref = doc(db, `users/${user.uid}/habit_logs/${today}/${habitId}`);
    if (completed) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { status: "completed", timestamp: new Date().toISOString() });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const createHabit = async () => {
    if (!newHabitName.trim()) return;

    if (isGuest) {
      const { useGuestStore, GUEST_MAX_HABITS } = await import("../store/useGuestStore");
      if (habits.length >= GUEST_MAX_HABITS) {
        Alert.alert("Limit reached", "Guest users can create up to 3 habits. Sign in for unlimited habits.");
        return;
      }
      useGuestStore.getState().addGuestHabit({
        id: Date.now().toString(),
        name: newHabitName,
        frequency: "daily",
        time_of_day: newHabitTime,
        icon: newHabitIcon,
        color: "#7C6FF7",
      });
    } else if (user?.uid) {
      const habitsRef = collection(db, `users/${user.uid}/habits`);
      await addDoc(habitsRef, {
        name: newHabitName,
        frequency: "daily",
        time_of_day: newHabitTime,
        icon: newHabitIcon,
        color: "#7C6FF7",
        created_at: serverTimestamp(),
        active: true,
      });
    }

    setNewHabitName("");
    setShowCreate(false);
  };

  const deleteHabit = async (habitId: string) => {
    if (!user?.uid) return;
    Alert.alert("Delete Habit", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, `users/${user.uid}/habits/${habitId}`));
          setShowAction(null);
        },
      },
    ]);
  };

  const openEdit = (habit: any) => {
    setEditHabit(habit);
    setEditName(habit.name);
    setEditIcon(habit.icon || "check");
    setEditTime(habit.time_of_day || "anytime");
    setShowAction(null);
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!user?.uid || !editHabit) return;
    await updateDoc(doc(db, `users/${user.uid}/habits/${editHabit.id}`), {
      name: editName,
      icon: editIcon,
      time_of_day: editTime,
    });
    setShowEdit(false);
    setEditHabit(null);
  };

  return (
    <ScrollView className="flex-1 bg-lumina-bg-primary" showsVerticalScrollIndicator={false}>
      <View className="pt-16 px-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-lumina-text-primary text-2xl font-bold">Habits</Text>
          <TouchableOpacity
            onPress={() => setShowCreate(true)}
            className="bg-lumina-accent-purple rounded-xl px-4 py-2.5"
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Today's Habits */}
        <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Today</Text>
        <View className="gap-2 mb-6">
          {habits.length === 0 ? (
            <View className="bg-lumina-bg-card rounded-2xl p-6 items-center">
              <Ionicons name="checkmark-circle-outline" size={40} color="#5A5A6E" />
              <Text className="text-lumina-text-muted text-sm mt-3">No habits yet. Create one!</Text>
            </View>
          ) : (
            habits.map((habit) => {
              const isCompleted = todayLogs[habit.id] === "completed";
              return (
                <TouchableOpacity
                  key={habit.id}
                  onPress={() => toggleHabit(habit.id, isCompleted)}
                  onLongPress={() => setShowAction(habit.id)}
                  className={`bg-lumina-bg-card rounded-xl p-4 flex-row items-center justify-between ${
                    isCompleted ? "opacity-60" : ""
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: `${habit.color || "#7C6FF7"}20` }}
                    >
                      <Ionicons
                        name={isCompleted ? "checkmark" : (habit.icon || "ellipse") as any}
                        size={18}
                        color={habit.color || "#7C6FF7"}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`text-sm font-semibold ${
                          isCompleted ? "text-lumina-text-muted line-through" : "text-lumina-text-primary"
                        }`}
                      >
                        {habit.name}
                      </Text>
                      <Text className="text-lumina-text-muted text-xs capitalize">
                        {habit.time_of_day || "anytime"} · hold for more
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isCompleted
                        ? "bg-lumina-accent-teal border-lumina-accent-teal"
                        : "border-lumina-text-muted/30"
                    }`}
                  >
                    {isCompleted && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Heatmap */}
        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-6">
          <Text className="text-lumina-text-secondary text-xs font-medium mb-3">
            Habit DNA — Last 4 Weeks
          </Text>
          <Heatmap data={todayLogs} size={260} />
        </View>
      </View>

      {/* Action Modal */}
      <Modal visible={!!showAction} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-8">
          <View className="bg-lumina-bg-card rounded-2xl p-6 w-full">
            <Text className="text-lumina-text-primary text-lg font-bold mb-4">Habit Actions</Text>
            {[
              { icon: "create-outline", label: "Edit", onPress: () => openEdit(habits.find((h) => h.id === showAction)) },
              { icon: "trash-outline", label: "Delete", onPress: () => showAction && deleteHabit(showAction), color: "#FF6B6B" },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={action.onPress}
                className="flex-row items-center gap-3 py-3.5 border-b border-lumina-bg-secondary"
              >
                <Ionicons name={action.icon as any} size={20} color={action.color || "#A0A0B0"} />
                <Text className={`text-sm ${action.color ? "text-lumina-accent-coral" : "text-lumina-text-primary"}`}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowAction(null)} className="mt-4 py-3 rounded-xl bg-lumina-bg-secondary items-center">
              <Text className="text-lumina-text-secondary font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEdit} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-8">
          <View className="bg-lumina-bg-card rounded-2xl p-6 w-full">
            <Text className="text-lumina-text-primary text-lg font-bold mb-4">Edit Habit</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Habit name"
              placeholderTextColor="#5A5A6E"
              className="bg-lumina-bg-secondary rounded-xl px-4 py-3 text-lumina-text-primary text-base mb-4"
            />
            <Text className="text-lumina-text-secondary text-xs font-medium mb-2">Icon</Text>
            <View className="flex-row gap-2 flex-wrap mb-4">
              {HabitIcons.map((icon: any) => (
                <TouchableOpacity
                  key={icon.name}
                  onPress={() => setEditIcon(icon.name)}
                  className={`w-10 h-10 rounded-xl items-center justify-center ${
                    editIcon === icon.name
                      ? "bg-lumina-accent-purple/20 border border-lumina-accent-purple"
                      : "bg-lumina-bg-secondary"
                  }`}
                >
                  <Ionicons name={icon.name as any} size={18} color={editIcon === icon.name ? "#7C6FF7" : "#5A5A6E"} />
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-lumina-text-secondary text-xs font-medium mb-2">Time of Day</Text>
            <View className="flex-row gap-2 mb-4">
              {["morning", "afternoon", "evening", "anytime"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setEditTime(t)}
                  className={`flex-1 py-2.5 rounded-xl items-center ${
                    editTime === t ? "bg-lumina-accent-purple/20 border border-lumina-accent-purple" : "bg-lumina-bg-secondary"
                  }`}
                >
                  <Text className={`text-xs font-medium capitalize ${editTime === t ? "text-lumina-accent-purple" : "text-lumina-text-muted"}`}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => { setShowEdit(false); setEditHabit(null); }} className="flex-1 py-3 rounded-xl bg-lumina-bg-secondary items-center">
                <Text className="text-lumina-text-secondary font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit} className="flex-1 py-3 rounded-xl bg-lumina-accent-purple items-center">
                <Text className="text-white font-medium">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Habit Modal */}
      <Modal visible={showCreate} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-8">
          <View className="bg-lumina-bg-card rounded-2xl p-6 w-full">
            <Text className="text-lumina-text-primary text-lg font-bold mb-4">New Habit</Text>
            <TextInput
              value={newHabitName}
              onChangeText={setNewHabitName}
              placeholder="Habit name"
              placeholderTextColor="#5A5A6E"
              className="bg-lumina-bg-secondary rounded-xl px-4 py-3 text-lumina-text-primary text-base mb-4"
            />
            <Text className="text-lumina-text-secondary text-xs font-medium mb-2">Icon</Text>
            <View className="flex-row gap-2 flex-wrap mb-4">
              {HabitIcons.map((icon: any) => (
                <TouchableOpacity
                  key={icon.name}
                  onPress={() => setNewHabitIcon(icon.name)}
                  className={`w-10 h-10 rounded-xl items-center justify-center ${
                    newHabitIcon === icon.name
                      ? "bg-lumina-accent-purple/20 border border-lumina-accent-purple"
                      : "bg-lumina-bg-secondary"
                  }`}
                >
                  <Ionicons name={icon.name as any} size={18} color={newHabitIcon === icon.name ? "#7C6FF7" : "#5A5A6E"} />
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-lumina-text-secondary text-xs font-medium mb-2">Time of Day</Text>
            <View className="flex-row gap-2 mb-4">
              {["morning", "afternoon", "evening", "anytime"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setNewHabitTime(t)}
                  className={`flex-1 py-2.5 rounded-xl items-center ${
                    newHabitTime === t ? "bg-lumina-accent-purple/20 border border-lumina-accent-purple" : "bg-lumina-bg-secondary"
                  }`}
                >
                  <Text className={`text-xs font-medium capitalize ${newHabitTime === t ? "text-lumina-accent-purple" : "text-lumina-text-muted"}`}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl bg-lumina-bg-secondary items-center">
                <Text className="text-lumina-text-secondary font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createHabit} className="flex-1 py-3 rounded-xl bg-lumina-accent-purple items-center">
                <Text className="text-white font-medium">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}