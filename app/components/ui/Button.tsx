import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const sizeStyle = size === "sm" ? { paddingHorizontal: 16, paddingVertical: 10 } : size === "lg" ? { paddingHorizontal: 32, paddingVertical: 16 } : { paddingHorizontal: 24, paddingVertical: 14 };

  const variantStyle =
    variant === "primary"
      ? { backgroundColor: "#7C6FF7" }
      : variant === "secondary"
      ? { backgroundColor: "#1A1A24", borderWidth: 1, borderColor: "rgba(90, 90, 110, 0.3)" }
      : { backgroundColor: "transparent" };

  const textStyle =
    variant === "primary"
      ? { color: "#FFFFFF", fontWeight: "600" as const }
      : variant === "secondary"
      ? { color: "#FFFFFF", fontWeight: "500" as const }
      : { color: "#7C6FF7", fontWeight: "500" as const };

  const textSize = size === "sm" ? { fontSize: 14 } : size === "lg" ? { fontSize: 18 } : { fontSize: 16 };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        { borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center" },
        sizeStyle,
        variantStyle,
        disabled ? { opacity: 0.5 } : {},
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#7C6FF7"} size="small" />
      ) : (
        <>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text style={[textStyle, textSize]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
