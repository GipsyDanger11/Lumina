export const Colors = {
  bg: {
    primary: "#0A0A0F",
    secondary: "#12121A",
    card: "#1A1A24",
  },
  accent: {
    purple: "#7C6FF7",
    teal: "#4ECDC4",
    coral: "#FF6B6B",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#A0A0B0",
    muted: "#5A5A6E",
  },
  success: "#4ECDC4",
  warning: "#FFD93D",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const HabitIcons = [
  { name: "leaf-outline", label: "Meditation" },
  { name: "walk-outline", label: "Walk" },
  { name: "book-outline", label: "Read" },
  { name: "pencil-outline", label: "Journal" },
  { name: "water-outline", label: "Water" },
  { name: "bed-outline", label: "Sleep" },
  { name: "barbell-outline", label: "Exercise" },
  { name: "hand-left-outline", label: "Stretch" },
  { name: "medical-outline", label: "Supplement" },
  { name: "fitness-outline", label: "Breathe" },
];

export const ActivityLevels = [
  { value: "sedentary", label: "Sedentary", description: "Mostly sitting, little exercise" },
  { value: "light", label: "Light", description: "Light walks, some movement" },
  { value: "moderate", label: "Moderate", description: "Regular exercise 3-4x/week" },
  { value: "active", label: "Active", description: "Daily exercise or physical job" },
  { value: "very_active", label: "Very Active", description: "Intense daily training" },
];

export const SleepQualities = [
  { value: "poor", label: "Poor", color: "#FF6B6B" },
  { value: "okay", label: "Okay", color: "#FFD93D" },
  { value: "good", label: "Good", color: "#4ECDC4" },
  { value: "great", label: "Great", color: "#7C6FF7" },
];

export const HealthGoals = [
  "Better sleep",
  "More hydration",
  "Build habits",
  "Weight management",
  "More energy",
  "Reduce stress",
  "Better nutrition",
  "Morning routine",
  "Mindfulness",
  "Fitness",
];
