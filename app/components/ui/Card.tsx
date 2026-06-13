import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { T, S } from "../../lib/theme";

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
        activeOpacity={0.8}
        style={[
          {
            backgroundColor: T.glass.bg,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: T.glass.border,
            ...S.shadow(8),
          },
          style,
        ]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: T.glass.bg,
          borderRadius: 24,
          padding: 20,
          borderWidth: 1,
          borderColor: T.glass.border,
          ...S.shadow(8),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  onPress?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = T.accent.purple,
  onPress,
}: StatCardProps) {
  return (
    <Card onPress={onPress} style={{ flex: 1, minWidth: "45%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: T.text.muted,
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {title}
        </Text>
        {icon && (
          <View
            style={{
              backgroundColor: `${color}20`,
              width: 32,
              height: 32,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </View>
        )}
      </View>
      <Text
        style={{
          color: T.text.primary,
          fontSize: 28,
          fontWeight: "800",
          letterSpacing: -1,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
      {subtitle && (
        <Text
          style={{
            color: T.text.muted,
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {subtitle}
        </Text>
      )}
    </Card>
  );
}