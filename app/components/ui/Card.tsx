import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

export function Card({ children, onPress, style }: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16 }, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16 }, style]}>{children}</View>;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  onPress?: () => void;
}

export function StatCard({ title, value, subtitle, icon, color = "#7C6FF7", onPress }: StatCardProps) {
  return (
    <Card onPress={onPress} style={{ flex: 1, minWidth: "45%" }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500" }}>{title}</Text>
        {icon && <View style={{ backgroundColor: `${color}20`, padding: 6, borderRadius: 8 }}>{icon}</View>}
      </View>
      <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
      {subtitle && <Text style={{ color: "#5A5A6E", fontSize: 12, marginTop: 4 }}>{subtitle}</Text>}
    </Card>
  );
}
