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
    <View className="items-center">
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
      <View className="flex-row gap-4 mt-3">
        {segments.map((segment, i) => (
          <View key={i} className="flex-row items-center gap-1">
            <View style={{ backgroundColor: segment.color }} className="w-2 h-2 rounded-full" />
            <Text className="text-lumina-text-secondary text-xs">{segment.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
