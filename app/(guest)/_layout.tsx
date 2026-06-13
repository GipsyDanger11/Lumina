import { Stack } from "expo-router";

export default function GuestLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0B0B1A" },
      }}
    />
  );
}
