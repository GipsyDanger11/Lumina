import React from "react";
import { View, Text } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface HeatmapProps {
  data: Record<string, string>;
  size?: number;
}

const STATUS_COLORS: Record<string, string> = {
  completed: "#4ECDC4",
  skipped: "#FF6B6B",
  none: "#1A1A24",
};

export function Heatmap({ data, size = 280 }: HeatmapProps) {
  const cellSize = size / 7;
  const today = new Date();
  const weeks = 4;
  const totalDays = weeks * 7;

  const cells: Array<{ date: string; status: string; col: number; row: number }> = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().split("T")[0];
    const dayIndex = (totalDays - 1 - i);
    const col = dayIndex % 7;
    const row = Math.floor(dayIndex / 7);
    cells.push({
      date: key,
      status: data[key] || "none",
      col,
      row,
    });
  }

  return (
    <View>
      <Text style={{ color: "#A0A0B0", fontSize: 12, marginBottom: 8 }}>Last 4 weeks</Text>
      <Svg width={size} height={size}>
        {cells.map((cell, i) => (
          <Rect
            key={i}
            x={cell.col * (cellSize + 2)}
            y={cell.row * (cellSize + 2)}
            width={cellSize - 2}
            height={cellSize - 2}
            rx={4}
            fill={STATUS_COLORS[cell.status]}
            opacity={cell.status === "none" ? 0.3 : 0.9}
          />
        ))}
      </Svg>
      <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <View key={status} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ backgroundColor: color, width: 10, height: 10, borderRadius: 2 }} />
            <Text style={{ color: "#5A5A6E", fontSize: 12, textTransform: "capitalize" }}>{status}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
