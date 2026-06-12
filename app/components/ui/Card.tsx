import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export function Card({ children, onPress, className = "" }: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={`bg-lumina-bg-card rounded-2xl p-4 ${className}`}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View className={`bg-lumina-bg-card rounded-2xl p-4 ${className}`}>{children}</View>;
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
    <Card onPress={onPress} className="flex-1 min-w-[45%]">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lumina-text-secondary text-xs font-medium">{title}</Text>
        {icon && <View style={{ backgroundColor: `${color}20` }} className="p-1.5 rounded-lg">{icon}</View>}
      </View>
      <Text className="text-lumina-text-primary text-2xl font-bold" style={{ fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
      {subtitle && <Text className="text-lumina-text-muted text-xs mt-1">{subtitle}</Text>}
    </Card>
  );
}
