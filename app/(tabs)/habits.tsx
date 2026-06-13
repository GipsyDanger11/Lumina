import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useHealth } from "../../hooks/useHealth";
import { Heatmap } from "../../components/charts/Heatmap";
import {
  db,
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from "../../lib/firebase";
import { useUserStore } from "../../store/useUserStore";
import { HabitIcons } from "../../constants";
import { T, S } from "../../lib/theme";

const RING_SIZE = 52;
const RING_STROKE = 5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

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

  const completedCount = habits.filter(
    (h) => todayLogs[h.id] === "completed"
  ).length;
  const completionRate =
    habits.length > 0
      ? Math.round((completedCount / habits.length) * 100)
      : 0;

  const toggleHabit = async (habitId: string, completed: boolean) => {
    if (isGuest) {
      const { useGuestStore } = await import("../../store/useGuestStore");
      useGuestStore
        .getState()
        .completeGuestHabit(habitId, completed ? "completed" : "pending");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    if (!user?.uid) return;
    const ref = doc(db, `users/${user.uid}/habit_logs/${today}/${habitId}`);
    if (completed) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        status: "completed",
        timestamp: new Date().toISOString(),
      });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const createHabit = async () => {
    if (!newHabitName.trim()) return;

    if (isGuest) {
      const { useGuestStore, GUEST_MAX_HABITS } = await import(
        "../../store/useGuestStore"
      );
      if (habits.length >= GUEST_MAX_HABITS) {
        Alert.alert(
          "Limit reached",
          "Guest users can create up to 3 habits. Sign in for unlimited habits."
        );
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

  const renderProgressRing = (progress: number, color: string) => {
    const offset = RING_CIRCUMFERENCE - (progress / 100) * RING_CIRCUMFERENCE;
    return (
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={T.bg.elevated}
          strokeWidth={RING_STROKE}
          fill="none"
        />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={color}
          strokeWidth={RING_STROKE}
          fill="none"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </Svg>
    );
  };

  const habitColors = [
    T.accent.teal,
    T.accent.purple,
    T.accent.coral,
    T.accent.gold,
    T.accent.blue,
    T.accent.pink,
  ];

  return (
    <ScrollView
      style={S.screen}
      contentContainerStyle={S.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          paddingTop: 56,
        }}
      >
        <Text style={{ color: T.text.primary, fontSize: 28, fontWeight: "800", letterSpacing: -0.5 }}>
          Habits
        </Text>
        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          activeOpacity={0.7}
          style={{
            backgroundColor: T.accent.purple,
            borderRadius: 14,
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            ...Platform.select({
              ios: {
                shadowColor: T.accent.purple,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
              },
              android: { elevation: 8 },
            }),
          }}
        >
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Completion Overview */}
      <View style={S.glassCard({ marginBottom: 20 })}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <View style={{ alignItems: "center" }}>
            {renderProgressRing(completionRate, T.accent.teal)}
            <Text
              style={{
                position: "absolute",
                top: RING_SIZE / 2 - 10,
                color: T.text.primary,
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              {completionRate}%
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: T.text.primary, fontSize: 22, fontWeight: "800", letterSpacing: -0.5 }}>
              {completedCount}/{habits.length}
            </Text>
            <Text style={S.statLabel}>habits completed today</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: T.accent.gold, fontSize: 22, fontWeight: "800" }}>
              {habitLogs && Object.keys(todayLogs).length > 0
                ? Object.values(todayLogs).filter((s) => s === "completed").length
                : 0}
            </Text>
            <Text style={S.statLabel}>streak days</Text>
          </View>
        </View>
      </View>

      {/* Today's Habits */}
      <Text style={S.sectionTitle}>Today</Text>
      <View style={{ gap: 10, marginBottom: 24 }}>
        {habits.length === 0 ? (
          <View style={S.glassCard({ alignItems: "center", paddingVertical: 40 })}>
            <Ionicons name="checkmark-circle-outline" size={48} color={T.text.muted} />
            <Text style={{ color: T.text.muted, fontSize: 15, marginTop: 14, fontWeight: "500" }}>
              No habits yet. Create one!
            </Text>
          </View>
        ) : (
          habits.map((habit, index) => {
            const isCompleted = todayLogs[habit.id] === "completed";
            const accentColor = habitColors[index % habitColors.length];
            return (
              <TouchableOpacity
                key={habit.id}
                onPress={() => toggleHabit(habit.id, isCompleted)}
                onLongPress={() => setShowAction(habit.id)}
                activeOpacity={0.7}
                style={{
                  ...S.glassCard({
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    marginBottom: 0,
                    opacity: isCompleted ? 0.6 : 1,
                    borderColor: isCompleted
                      ? `${T.accent.teal}40`
                      : T.glass.border,
                  }),
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${accentColor}18`,
                    borderWidth: 1,
                    borderColor: `${accentColor}25`,
                  }}
                >
                  <Ionicons
                    name={
                      isCompleted
                        ? ("checkmark" as any)
                        : ((habit.icon || "ellipse") as any)
                    }
                    size={20}
                    color={isCompleted ? T.accent.teal : accentColor}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: isCompleted ? T.text.muted : T.text.primary,
                      textDecorationLine: isCompleted ? "line-through" : "none",
                    }}
                  >
                    {habit.name}
                  </Text>
                  <Text style={{ color: T.text.muted, fontSize: 12, marginTop: 2, textTransform: "capitalize" }}>
                    {habit.time_of_day || "anytime"} · hold for more
                  </Text>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                  {renderProgressRing(isCompleted ? 100 : 0, accentColor)}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Heatmap */}
      <Text style={S.sectionTitle}>Habit DNA</Text>
      <View style={S.glassCard({ padding: 16, marginBottom: 24 })}>
        <Heatmap data={todayLogs} size={260} />
      </View>

      {/* Add Habit Button */}
      <TouchableOpacity
        onPress={() => setShowCreate(true)}
        activeOpacity={0.8}
        style={{ marginBottom: 32 }}
      >
        <LinearGradient
          colors={[...T.gradient.coral]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 18,
            paddingVertical: 18,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            ...Platform.select({
              ios: {
                shadowColor: T.accent.coral,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
              },
              android: { elevation: 10 },
            }),
          }}
        >
          <Ionicons name="add-circle" size={22} color="#FFF" />
          <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>
            Add Habit
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Action Modal */}
      <Modal visible={!!showAction} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <View style={S.glassCard({ width: "100%", padding: 28 })}>
            <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "800", marginBottom: 20 }}>
              Habit Actions
            </Text>
            {[
              {
                icon: "create-outline",
                label: "Edit",
                onPress: () =>
                  openEdit(habits.find((h) => h.id === showAction)),
                color: T.text.secondary,
              },
              {
                icon: "trash-outline",
                label: "Delete",
                onPress: () => showAction && deleteHabit(showAction),
                color: T.accent.coral,
              },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={action.onPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: T.glass.border,
                }}
              >
                <Ionicons name={action.icon as any} size={22} color={action.color} />
                <Text style={{ fontSize: 15, fontWeight: "500", color: action.color }}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowAction(null)}
              style={{
                marginTop: 20,
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: T.bg.elevated,
                alignItems: "center",
              }}
            >
              <Text style={{ color: T.text.muted, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEdit} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <View style={S.glassCard({ width: "100%", padding: 28 })}>
            <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "800", marginBottom: 20 }}>
              Edit Habit
            </Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Habit name"
              placeholderTextColor={T.text.muted}
              style={{
                backgroundColor: T.bg.elevated,
                borderRadius: 14,
                paddingHorizontal: 18,
                paddingVertical: 14,
                color: T.text.primary,
                fontSize: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
            />
            <Text style={{ color: T.text.secondary, fontSize: 12, fontWeight: "600", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              Icon
            </Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {HabitIcons.map((icon: any) => (
                <TouchableOpacity
                  key={icon.name}
                  onPress={() => setEditIcon(icon.name)}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      editIcon === icon.name
                        ? `${T.accent.purple}25`
                        : T.bg.elevated,
                    borderWidth: editIcon === icon.name ? 1.5 : 0,
                    borderColor: editIcon === icon.name ? T.accent.purple : "transparent",
                  }}
                >
                  <Ionicons
                    name={icon.name as any}
                    size={18}
                    color={editIcon === icon.name ? T.accent.purple : T.text.muted}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ color: T.text.secondary, fontSize: 12, fontWeight: "600", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              Time of Day
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
              {["morning", "afternoon", "evening", "anytime"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setEditTime(t)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor:
                      editTime === t
                        ? `${T.accent.purple}25`
                        : T.bg.elevated,
                    borderWidth: editTime === t ? 1.5 : 0,
                    borderColor: editTime === t ? T.accent.purple : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      textTransform: "capitalize",
                      color: editTime === t ? T.accent.purple : T.text.muted,
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowEdit(false);
                  setEditHabit(null);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: T.bg.elevated,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: T.text.muted, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveEdit}
                style={{
                  flex: 1,
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
                <Text style={{ color: "#FFF", fontWeight: "700" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Habit Modal */}
      <Modal visible={showCreate} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <View style={S.glassCard({ width: "100%", padding: 28 })}>
            <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "800", marginBottom: 20 }}>
              New Habit
            </Text>
            <TextInput
              value={newHabitName}
              onChangeText={setNewHabitName}
              placeholder="Habit name"
              placeholderTextColor={T.text.muted}
              style={{
                backgroundColor: T.bg.elevated,
                borderRadius: 14,
                paddingHorizontal: 18,
                paddingVertical: 14,
                color: T.text.primary,
                fontSize: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
            />
            <Text style={{ color: T.text.secondary, fontSize: 12, fontWeight: "600", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              Icon
            </Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {HabitIcons.map((icon: any) => (
                <TouchableOpacity
                  key={icon.name}
                  onPress={() => setNewHabitIcon(icon.name)}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      newHabitIcon === icon.name
                        ? `${T.accent.purple}25`
                        : T.bg.elevated,
                    borderWidth: newHabitIcon === icon.name ? 1.5 : 0,
                    borderColor:
                      newHabitIcon === icon.name ? T.accent.purple : "transparent",
                  }}
                >
                  <Ionicons
                    name={icon.name as any}
                    size={18}
                    color={newHabitIcon === icon.name ? T.accent.purple : T.text.muted}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ color: T.text.secondary, fontSize: 12, fontWeight: "600", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              Time of Day
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
              {["morning", "afternoon", "evening", "anytime"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setNewHabitTime(t)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor:
                      newHabitTime === t
                        ? `${T.accent.purple}25`
                        : T.bg.elevated,
                    borderWidth: newHabitTime === t ? 1.5 : 0,
                    borderColor: newHabitTime === t ? T.accent.purple : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      textTransform: "capitalize",
                      color: newHabitTime === t ? T.accent.purple : T.text.muted,
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowCreate(false)}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: T.bg.elevated,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: T.text.muted, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={createHabit}
                style={{
                  flex: 1,
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
                <Text style={{ color: "#FFF", fontWeight: "700" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
