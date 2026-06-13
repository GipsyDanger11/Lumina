import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, setToken as apiSetToken, clearToken } from "../lib/api";
import { useUserStore } from "../store/useUserStore";

const TOKEN_KEY = "lumina_token";

export function useAuth() {
  const { user, setUser, setToken, setIsLoading } = useUserStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(TOKEN_KEY);
        if (stored) {
          await apiSetToken(stored);
          const { user: userData } = await authApi.me();
          setToken(stored);
          setUser({ id: userData.id, email: userData.email, name: userData.name });
        }
      } catch {
        await clearToken();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
        setReady(true);
      }
    })();
  }, []);

  return { user, isLoading: !ready, isAuthenticated: !!user };
}
