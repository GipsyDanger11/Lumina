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
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  className = "",
}: ButtonProps) {
  const baseStyle = "rounded-2xl flex-row items-center justify-center";
  const sizeStyle = size === "sm" ? "px-4 py-2.5" : size === "lg" ? "px-8 py-4" : "px-6 py-3.5";
  const variantStyle =
    variant === "primary"
      ? "bg-lumina-accent-purple"
      : variant === "secondary"
      ? "bg-lumina-bg-card border border-lumina-text-muted/30"
      : "bg-transparent";

  const textStyle =
    variant === "primary"
      ? "text-white font-semibold"
      : variant === "secondary"
      ? "text-lumina-text-primary font-medium"
      : "text-lumina-accent-purple font-medium";

  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#7C6FF7"} size="small" />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`${textStyle} ${textSize}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
