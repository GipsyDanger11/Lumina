import { useState, useCallback, useRef } from "react";
import { runAgentLoop, extractObservations, HealthContext, Message } from "../lib/mistral";
import { useUserStore } from "../store/useUserStore";
import { useHealthStore } from "../store/useHealthStore";
import { useGuestStore, GUEST_MAX_SESSIONS } from "../store/useGuestStore";
import { getMemories, addMemory } from "../lib/firebase";

export function useCompanion() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const user = useUserStore((s) => s.user);
  const profile = useUserStore((s) => s.profile);
  const isGuest = useUserStore((s) => s.isGuest);
  const healthState = useHealthStore();
  const guestStore = useGuestStore();
  const memoriesRef = useRef<string[]>([]);

  const buildContext = useCallback((): HealthContext => {
    const today = new Date().toISOString().split("T")[0];
    return {
      user: {
        name: profile?.name || "Guest",
        age: profile?.age || 0,
        gender: profile?.gender || "not specified",
        height: profile?.height || "not specified",
        weight: profile?.weight || "not specified",
        wake_time: profile?.wake_time || "7:00 AM",
        bedtime: profile?.bedtime || "11:00 PM",
        activity_level: profile?.activity_level || "moderate",
        goals: profile?.goals || [],
        water_goal_ml: profile?.water_goal_ml || 2500,
        sleep_goal_hours: profile?.sleep_goal_hours || 8,
      },
      today: {
        date: today,
        water_ml: healthState.todayTotalMl,
        water_goal_ml: profile?.water_goal_ml || 2500,
        sleep_hours: healthState.todaySleep?.hours || 0,
        sleep_quality: healthState.todaySleep?.quality || "not logged",
        sleep_avg: 7,
        habits_done: Object.values(healthState.todayHabitLogs).filter(
          (v) => v === "completed"
        ).length,
        habits_total: healthState.habits.length,
        meals_logged: healthState.meals.length,
        mood: healthState.todayMood,
        streak_days: healthState.streakDays,
      },
      memories: memoriesRef.current,
      week_summary: {},
    };
  }, [profile, healthState]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (isGuest && guestStore.companionSessionCount >= GUEST_MAX_SESSIONS) {
        const guestLimitMsg: Message = {
          role: "assistant",
          content:
            "You've reached the free session limit. Sign in to continue chatting with LuminaAI and unlock voice mode!",
        };
        setMessages((prev) => [...prev, { role: "user", content: text }, guestLimitMsg]);
        return;
      }

      const userMsg: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);

      if (isGuest) {
        guestStore.addCompanionMessage("user", text);
        guestStore.incrementSession();
      }

      setIsLoading(true);

      try {
        // Load memories for authenticated users
        if (!isGuest && user?.uid) {
          memoriesRef.current = await getMemories(user.uid);
        }

        const context = buildContext();
        const history = messages.slice(-10);

        const response = await runAgentLoop(
          text,
          context,
          history,
          user?.uid || "guest",
          (toolName, result) => {
            setToolStatus(`${toolName}: ${result}`);
            setTimeout(() => setToolStatus(null), 3000);
          }
        );

        const assistantMsg: Message = { role: "assistant", content: response };
        setMessages((prev) => [...prev, assistantMsg]);

        if (isGuest) {
          guestStore.addCompanionMessage("assistant", response);
        }

        // Extract and store memories in background
        if (!isGuest && user?.uid) {
          const allMessages = [...messages, userMsg, assistantMsg];
          extractObservations(allMessages, memoriesRef.current).then((obs) => {
            if (obs.length > 0) {
              addMemory(user.uid, obs);
              memoriesRef.current = [...memoriesRef.current, ...obs].slice(-10);
            }
          });
        }
      } catch (error) {
        const errorMsg: Message = {
          role: "assistant",
          content:
            "I had trouble processing that. Could you try again?",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, user, profile, isGuest, healthState, buildContext]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isSpeaking,
    toolStatus,
    sendMessage,
    clearMessages,
    setIsSpeaking,
    canSend: isGuest ? guestStore.companionSessionCount < GUEST_MAX_SESSIONS : true,
  };
}
