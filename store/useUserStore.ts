import { create } from "zustand";
import { User } from "firebase/auth";

interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: string;
  weight: string;
  wake_time: string;
  bedtime: string;
  activity_level: string;
  goals: string[];
  water_goal_ml: number;
  sleep_goal_hours: number;
  onboarding_complete: boolean;
  onboarding_method: "voice" | "text" | null;
}

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setIsGuest: (isGuest: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  isGuest: true,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsGuest: (isGuest) => set({ isGuest }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, profile: null, isGuest: true }),
}));
