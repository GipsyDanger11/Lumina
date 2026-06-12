import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface DonutChartProps {
  segments: Array<{ value: number; color: string; label: string }>;
  size?: number;
  strokeWidth?: number;
}

export function DonutChart({ segments, size = 120, strokeWidth = 12 }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulative = 0;

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {segments.map((segment, i) => {
            const segmentLength = total > 0 ? (segment.value / total) * circumference : 0;
            const offset = (cumulative / total) * circumference;
            cumulative += segment.value;
            return (
              <Circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>
      <View style={{ flexDirection: "row", gap: 16, marginTop: 12 }}>
        {segments.map((segment, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ backgroundColor: segment.color, width: 8, height: 8, borderRadius: 4 }} />
            <Text style={{ color: "#A0A0B0", fontSize: 12 }}>{segment.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
