import React from "react";
import { View, Text } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

interface WeeklyBarChartProps {
  data: Record<string, number>;
  goal?: number;
  barColor?: string;
  height?: number;
}

export function WeeklyBarChart({
  data,
  goal = 2500,
  barColor = "#7C6FF7",
  height = 150,
}: WeeklyBarChartProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const values = days.map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const key = date.toISOString().split("T")[0];
    return data[key] || 0;
  });

  const maxValue = Math.max(...values, goal);
  const barWidth = 28;
  const chartWidth = days.length * (barWidth + 12);

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ color: "#A0A0B0", fontSize: 12 }}>This Week</Text>
        <Text style={{ color: "#5A5A6E", fontSize: 12 }}>Goal: {goal}ml</Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Svg width={chartWidth} height={height + 20}>
          {values.map((value, i) => {
            const barHeight = maxValue > 0 ? (value / maxValue) * height : 0;
            const isOverGoal = value >= goal;
            return (
              <React.Fragment key={i}>
                <Rect
                  x={i * (barWidth + 12)}
                  y={height - barHeight}
                  width={barWidth}
                  height={barHeight}
                  rx={6}
                  fill={isOverGoal ? "#4ECDC4" : barColor}
                  opacity={0.9}
                />
                <SvgText
                  x={i * (barWidth + 12) + barWidth / 2}
                  y={height + 15}
                  textAnchor="middle"
                  fill="#5A5A6E"
                  fontSize={10}
                >
                  {days[i]}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}
