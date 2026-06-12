import React from "react";
import { View } from "react-native";

interface LoadingSkeletonProps {
  width?: string | number;
  height?: number;
}

export function LoadingSkeleton({
  width = "100%",
  height = 20,
}: LoadingSkeletonProps) {
  return (
    <View
      style={{ backgroundColor: "#1A1A24", width: typeof width === "number" ? width : "100%", height, borderRadius: 8 }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <View style={{ padding: 16, gap: 16 }}>
      <LoadingSkeleton height={24} width={200} />
      <LoadingSkeleton height={120} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <LoadingSkeleton height={100} width="48%" />
        <LoadingSkeleton height={100} width="48%" />
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <LoadingSkeleton height={100} width="48%" />
        <LoadingSkeleton height={100} width="48%" />
      </View>
    </View>
  );
}
