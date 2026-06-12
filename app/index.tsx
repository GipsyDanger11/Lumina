import { Redirect } from "expo-router";
import { useAuth } from "./hooks/useAuth";
import { useUserStore } from "./store/useUserStore";

export default function Index() {
  const { user, isLoading } = useAuth();
  const isGuest = useUserStore((s) => s.isGuest);
  const profile = useUserStore((s) => s.profile);

  if (isLoading) return null;

  if (user && !isGuest) {
    if (!profile?.onboarding_complete) {
      return <Redirect href="/(onboarding)/method" />;
    }
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(guest)" />;
}
