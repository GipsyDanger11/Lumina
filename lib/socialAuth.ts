import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleAuthProvider, OAuthProvider, signInWithCredential, auth } from "./firebase";

WebBrowser.maybeCompleteAuthSession();

let googleRequest: ReturnType<typeof Google.useAuthRequest> | null = null;

export async function signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!googleRequest) {
      googleRequest = await Google.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        scopes: ["profile", "email"],
      });
    }

    const [request, , promptAsync] = googleRequest;
    if (!request) {
      return { success: false, error: "Failed to initialize Google sign-in" };
    }

    const result = await promptAsync();
    if (result.type !== "success") {
      if (result.type === "cancel") return { success: false, error: "Sign-in cancelled" };
      return { success: false, error: "Google sign-in failed" };
    }

    const { id_token } = result.authentication as any;
    if (!id_token) {
      return { success: false, error: "No ID token received from Google" };
    }

    const credential = GoogleAuthProvider.credential(id_token);
    await signInWithCredential(auth, credential);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Google sign-in failed" };
  }
}

export async function signInWithApple(): Promise<{ success: boolean; error?: string }> {
  try {
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return { success: false, error: "Apple sign-in is not available on this device" };
    }

    const result = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!result.identityToken) {
      return { success: false, error: "No identity token received from Apple" };
    }

    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: result.identityToken,
    });

    await signInWithCredential(auth, credential);
    return { success: true };
  } catch (error: any) {
    if (error.code === "ERR_REQUEST_CANCELED") {
      return { success: false, error: "Sign-in cancelled" };
    }
    return { success: false, error: error.message || "Apple sign-in failed" };
  }
}
