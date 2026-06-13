import React from "react";
import { View, Text } from "react-native";
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop } from "react-native-svg";
import { T } from "../../lib/theme";

interface WeeklyBarChartProps {
  data: Record<string, number>;
  goal?: number;
  barColor?: string;
  height?: number;
}

export function WeeklyBarChart({
  data,
  goal = 2500,
  barColor = T.accent.purple,
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: T.text.secondary,
            fontSize: 13,
            fontWeight: "600",
          }}
        >
          This Week
        </Text>
        <Text
          style={{
            color: T.text.muted,
            fontSize: 12,
          }}
        >
          Goal: {goal}ml
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Svg width={chartWidth} height={height + 20}>
          <Defs>
            <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={barColor} stopOpacity="0.9" />
              <Stop offset="1" stopColor={barColor} stopOpacity="0.4" />
            </LinearGradient>
            <LinearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={T.accent.teal} stopOpacity="0.9" />
              <Stop offset="1" stopColor={T.accent.teal} stopOpacity="0.4" />
            </LinearGradient>
          </Defs>
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
                  fill={isOverGoal ? "url(#goalGradient)" : "url(#barGradient)"}
                />
                <SvgText
                  x={i * (barWidth + 12) + barWidth / 2}
                  y={height + 15}
                  textAnchor="middle"
                  fill={T.text.muted}
                  fontSize={10}
                  fontWeight="500"
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