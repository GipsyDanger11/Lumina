import { Platform } from "react-native";

export const T = {
  bg: {
    primary: "#0B0B1A",
    secondary: "#111127",
    card: "#181833",
    cardLight: "#1E1E42",
    elevated: "#22224A",
  },
  gradient: {
    coral: ["#FF6B6B", "#FF8E8E"],
    purple: ["#7C6FF7", "#9B8FFF"],
    teal: ["#4ECDC4", "#6BE8DF"],
    gold: ["#FFD93D", "#FFE566"],
    blue: ["#5B8DEF", "#7BA4F7"],
    pink: ["#FF6B9D", "#FF8EB8"],
  },
  accent: {
    purple: "#7C6FF7",
    purpleLight: "#9B8FFF",
    teal: "#4ECDC4",
    coral: "#FF6B6B",
    gold: "#FFD93D",
    blue: "#5B8DEF",
    pink: "#FF6B9D",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#B8B8D0",
    muted: "#6B6B8A",
    accent: "#9B8FFF",
  },
  shadow: {
    card: "rgba(0, 0, 0, 0.4)",
    glow: (color: string) => `${color}30`,
    elevated: "rgba(0, 0, 0, 0.6)",
  },
  glass: {
    bg: "rgba(24, 24, 51, 0.7)",
    border: "rgba(255, 255, 255, 0.08)",
  },
} as const;

export const S = {
  screen: { flex: 1, backgroundColor: T.bg.primary },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  sectionTitle: {
    color: T.text.secondary,
    fontSize: 13,
    fontWeight: "600" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    marginBottom: 12,
  },
  statNumber: (color: string) => ({
    color: color,
    fontSize: 36,
    fontWeight: "800" as const,
    letterSpacing: -1,
  }),
  statLabel: {
    color: T.text.muted,
    fontSize: 13,
    fontWeight: "500" as const,
    marginTop: 4,
  },
  card: (extra?: any) => ({
    backgroundColor: T.bg.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: T.glass.border,
    ...(extra || {}),
  }),
  cardElevated: (extra?: any) => ({
    backgroundColor: T.bg.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: T.glass.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
    ...(extra || {}),
  }),
  glassCard: (extra?: any) => ({
    backgroundColor: T.glass.bg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: T.glass.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
    ...(extra || {}),
  }),
  gradientCard: (colors: string[], extra?: any) => ({
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden" as const,
    ...Platform.select({
      ios: {
        shadowColor: colors[0],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
    ...(extra || {}),
  }),
  button: (color: string) => ({
    backgroundColor: color,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center" as const,
    ...Platform.select({
      ios: {
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  }),
  toggleTrack: (active: boolean) => ({
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: active ? T.accent.purple : "#2A2A4A",
    justifyContent: "center" as const,
    alignItems: active ? "flex-end" as const : "flex-start" as const,
    paddingHorizontal: 3,
  }),
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  shadow: (elevation: number, color?: string) => {
    const shadowColor = color || "#000";
    return Platform.select({
      ios: {
        shadowColor,
        shadowOffset: { width: 0, height: elevation },
        shadowOpacity: 0.3,
        shadowRadius: elevation * 2,
      },
      android: { elevation },
    });
  },
} as const;
