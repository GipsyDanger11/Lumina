import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import { useState } from "react";
import { authApi, setToken } from "../lib/api";
import { useUserStore } from "../store/useUserStore";

export function useSocialAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useUserStore((s) => s.setUser);
  const setAuthToken = useUserStore((s) => s.setToken);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  const signInWithGoogle = async (onSuccess?: () => void) => {
    setLoading(true);
    setError(null);
    try {
      const result = await promptAsync();
      if (result.type !== "success") {
        setError(result.type === "cancel" ? "Sign-in cancelled" : "Google sign-in failed");
        return;
      }
      const { id_token } = result.authentication as any;
      if (!id_token) {
        setError("No ID token received from Google");
        return;
      }

      // Decode basic info from id_token
      const payload = JSON.parse(atob(id_token.split(".")[1]));
      const { token, user } = await authApi.google(
        payload.email || "",
        payload.name || "User",
        payload.sub
      );
      await setToken(token);
      setAuthToken(token);
      setUser(user);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async (onSuccess?: () => void) => {
    setLoading(true);
    setError(null);
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        setError("Apple sign-in is not available on this device");
        return;
      }
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!result.identityToken) {
        setError("No identity token received from Apple");
        return;
      }

      const payload = JSON.parse(atob(result.identityToken.split(".")[1]));
      const { token, user } = await authApi.apple(
        payload.email || "",
        result.fullName?.givenName
          ? `${result.fullName.givenName} ${result.fullName.familyName || ""}`.trim()
          : "User",
        payload.sub
      );
      await setToken(token);
      setAuthToken(token);
      setUser(user);
      onSuccess?.();
    } catch (err: any) {
      if (err.code === "ERR_REQUEST_CANCELED") {
        setError("Sign-in cancelled");
      } else {
        setError(err.message || "Apple sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, signInWithApple, loading, error, setError };
}
