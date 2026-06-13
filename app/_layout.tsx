import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useAuth } from "./hooks/useAuth";
import { useUserStore } from "./store/useUserStore";
import { getUserProfile } from "./lib/firebase";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const { user, isLoading } = useAuth();
  const setProfile = useUserStore((s) => s.setProfile);
  const setIsGuest = useUserStore((s) => s.setIsGuest);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (user) {
      setIsGuest(false);
      getUserProfile(user.uid).then((profile) => {
        if (profile) setProfile(profile as any);
      });
    } else if (!isLoading) {
      setIsGuest(true);
    }
  }, [user, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0B0B1A" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="(guest)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
