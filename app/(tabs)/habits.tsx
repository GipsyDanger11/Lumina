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
    <ScrollView style={{ flex: 1, backgroundColor: "#0A0A0F" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 64, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700" }}>Habits</Text>
          <TouchableOpacity
            onPress={() => setShowCreate(true)}
            style={{ backgroundColor: "#7C6FF7", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Today's Habits */}
        <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Today</Text>
        <View style={{ gap: 8, marginBottom: 24 }}>
          {habits.length === 0 ? (
            <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, alignItems: "center" }}>
              <Ionicons name="checkmark-circle-outline" size={40} color="#5A5A6E" />
              <Text style={{ color: "#5A5A6E", fontSize: 14, marginTop: 12 }}>No habits yet. Create one!</Text>
            </View>
          ) : (
            habits.map((habit) => {
              const isCompleted = todayLogs[habit.id] === "completed";
              return (
                <TouchableOpacity
                  key={habit.id}
                  onPress={() => toggleHabit(habit.id, isCompleted)}
                  onLongPress={() => setShowAction(habit.id)}
                  style={{
                    backgroundColor: "#1A1A24",
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    opacity: isCompleted ? 0.6 : 1,
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                    <View
                      style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: `${habit.color || "#7C6FF7"}20` }}
                    >
                      <Ionicons
                        name={isCompleted ? "checkmark" : (habit.icon || "ellipse") as any}
                        size={18}
                        color={habit.color || "#7C6FF7"}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: isCompleted ? "#5A5A6E" : "#FFFFFF",
                          textDecorationLine: isCompleted ? "line-through" : "none",
                        }}
                      >
                        {habit.name}
                      </Text>
                      <Text style={{ color: "#5A5A6E", fontSize: 12, textTransform: "capitalize" }}>
                        {habit.time_of_day || "anytime"} · hold for more
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isCompleted ? "#4ECDC4" : "transparent",
                      borderColor: isCompleted ? "#4ECDC4" : "rgba(90, 90, 110, 0.3)",
                    }}
                  >
                    {isCompleted && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Heatmap */}
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>
            Habit DNA — Last 4 Weeks
          </Text>
          <Heatmap data={todayLogs} size={260} />
        </View>
      </View>

      {/* Action Modal */}
      <Modal visible={!!showAction} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, width: "100%" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 }}>Habit Actions</Text>
            {[
              { icon: "create-outline", label: "Edit", onPress: () => openEdit(habits.find((h) => h.id === showAction)) },
              { icon: "trash-outline", label: "Delete", onPress: () => showAction && deleteHabit(showAction), color: "#FF6B6B" },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={action.onPress}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#12121A" }}
              >
                <Ionicons name={action.icon as any} size={20} color={action.color || "#A0A0B0"} />
                <Text style={{ fontSize: 14, color: action.color ? "#FF6B6B" : "#FFFFFF" }}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowAction(null)} style={{ marginTop: 16, paddingVertical: 12, borderRadius: 12, backgroundColor: "#12121A", alignItems: "center" }}>
              <Text style={{ color: "#A0A0B0", fontWeight: "500" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEdit} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, width: "100%" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 }}>Edit Habit</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Habit name"
              placeholderTextColor="#5A5A6E"
              style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "#FFFFFF", fontSize: 16, marginBottom: 16 }}
            />
            <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 8 }}>Icon</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {HabitIcons.map((icon: any) => (
                <TouchableOpacity
                  key={icon.name}
                  onPress={() => setEditIcon(icon.name)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: editIcon === icon.name ? "rgba(124, 111, 247, 0.2)" : "#12121A",
                    borderWidth: editIcon === icon.name ? 1 : 0,
                    borderColor: editIcon === icon.name ? "#7C6FF7" : undefined,
                  }}
                >
                  <Ionicons name={icon.name as any} size={18} color={editIcon === icon.name ? "#7C6FF7" : "#5A5A6E"} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 8 }}>Time of Day</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              {["morning", "afternoon", "evening", "anytime"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setEditTime(t)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor: editTime === t ? "rgba(124, 111, 247, 0.2)" : "#12121A",
                    borderWidth: editTime === t ? 1 : 0,
                    borderColor: editTime === t ? "#7C6FF7" : undefined,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "500", textTransform: "capitalize", color: editTime === t ? "#7C6FF7" : "#5A5A6E" }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity onPress={() => { setShowEdit(false); setEditHabit(null); }} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#12121A", alignItems: "center" }}>
                <Text style={{ color: "#A0A0B0", fontWeight: "500" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#7C6FF7", alignItems: "center" }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Habit Modal */}
      <Modal visible={showCreate} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, width: "100%" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 }}>New Habit</Text>
            <TextInput
              value={newHabitName}
              onChangeText={setNewHabitName}
              placeholder="Habit name"
              placeholderTextColor="#5A5A6E"
              style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "#FFFFFF", fontSize: 16, marginBottom: 16 }}
            />
            <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 8 }}>Icon</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {HabitIcons.map((icon: any) => (
                <TouchableOpacity
                  key={icon.name}
                  onPress={() => setNewHabitIcon(icon.name)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: newHabitIcon === icon.name ? "rgba(124, 111, 247, 0.2)" : "#12121A",
                    borderWidth: newHabitIcon === icon.name ? 1 : 0,
                    borderColor: newHabitIcon === icon.name ? "#7C6FF7" : undefined,
                  }}
                >
                  <Ionicons name={icon.name as any} size={18} color={newHabitIcon === icon.name ? "#7C6FF7" : "#5A5A6E"} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 8 }}>Time of Day</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              {["morning", "afternoon", "evening", "anytime"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setNewHabitTime(t)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor: newHabitTime === t ? "rgba(124, 111, 247, 0.2)" : "#12121A",
                    borderWidth: newHabitTime === t ? 1 : 0,
                    borderColor: newHabitTime === t ? "#7C6FF7" : undefined,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "500", textTransform: "capitalize", color: newHabitTime === t ? "#7C6FF7" : "#5A5A6E" }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity onPress={() => setShowCreate(false)} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#12121A", alignItems: "center" }}>
                <Text style={{ color: "#A0A0B0", fontWeight: "500" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createHabit} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#7C6FF7", alignItems: "center" }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
