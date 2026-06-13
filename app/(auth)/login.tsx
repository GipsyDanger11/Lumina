import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { T } from "../lib/theme";
import {
  auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithRedirect,
} from "../lib/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Password must be 6+ characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      setErrors({ general: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setErrors({ general: error.message || "Google sign-in failed" });
    }
  };

  const handleAppleLogin = async () => {
    try {
      const provider = new OAuthProvider("apple.com");
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setErrors({ general: error.message || "Apple sign-in failed" });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: T.bg.primary }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: T.bg.card,
              borderWidth: 1,
              borderColor: T.glass.border,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <Ionicons name="chevron-back" size={22} color={T.text.secondary} />
          </TouchableOpacity>

          <Text
            style={{
              color: T.text.primary,
              fontSize: 32,
              fontWeight: "800",
              letterSpacing: -0.5,
              marginBottom: 8,
            }}
          >
            Welcome back
          </Text>
          <Text
            style={{
              color: T.text.muted,
              fontSize: 16,
              marginBottom: 36,
              lineHeight: 22,
            }}
          >
            Sign in to continue to Lumina
          </Text>

          {errors.general && (
            <View
              style={{
                backgroundColor: "rgba(255, 107, 107, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(255, 107, 107, 0.2)",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: T.accent.coral, fontSize: 14 }}>
                {errors.general}
              </Text>
            </View>
          )}

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                color: T.text.secondary,
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Email
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: T.glass.bg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor:
                  focusedField === "email"
                    ? T.accent.purple
                    : errors.email
                      ? T.accent.coral
                      : T.glass.border,
                paddingHorizontal: 16,
                height: 52,
              }}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={
                  focusedField === "email"
                    ? T.accent.purpleLight
                    : T.text.muted
                }
                style={{ marginRight: 12 }}
              />
              <TextInput
                style={{ flex: 1, color: T.text.primary, fontSize: 16 }}
                placeholder="your@email.com"
                placeholderTextColor={T.text.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            {errors.email && (
              <Text
                style={{ color: T.accent.coral, fontSize: 12, marginTop: 6 }}
              >
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: T.text.secondary,
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: T.glass.bg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor:
                  focusedField === "password"
                    ? T.accent.purple
                    : errors.password
                      ? T.accent.coral
                      : T.glass.border,
                paddingHorizontal: 16,
                height: 52,
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={
                  focusedField === "password"
                    ? T.accent.purpleLight
                    : T.text.muted
                }
                style={{ marginRight: 12 }}
              />
              <TextInput
                style={{ flex: 1, color: T.text.primary, fontSize: 16 }}
                placeholder="Enter your password"
                placeholderTextColor={T.text.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            {errors.password && (
              <Text
                style={{ color: T.accent.coral, fontSize: 12, marginTop: 6 }}
              >
                {errors.password}
              </Text>
            )}
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 24 }}>
            <Text
              style={{
                color: T.accent.purpleLight,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Sign In button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
            style={{ marginBottom: 32 }}
          >
            <LinearGradient
              colors={T.gradient.purple}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
                ...Platform.select({
                  ios: {
                    shadowColor: T.accent.purple,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                  },
                  android: { elevation: 8 },
                }),
              }}
            >
              {loading ? (
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderWidth: 2,
                    borderColor: "rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: 11,
                  }}
                />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 17,
                    fontWeight: "700",
                    letterSpacing: 0.3,
                  }}
                >
                  Sign In
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
            <Text
              style={{
                color: T.text.muted,
                fontSize: 13,
                fontWeight: "500",
                marginHorizontal: 16,
              }}
            >
              or continue with
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
          </View>

          {/* Social buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 36 }}>
            <TouchableOpacity
              onPress={handleGoogleLogin}
              activeOpacity={0.7}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 16,
                backgroundColor: T.glass.bg,
                borderWidth: 1,
                borderColor: T.glass.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Ionicons name="logo-google" size={18} color={T.text.secondary} />
              <Text
                style={{
                  color: T.text.secondary,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAppleLogin}
              activeOpacity={0.7}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 16,
                backgroundColor: T.glass.bg,
                borderWidth: 1,
                borderColor: T.glass.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Ionicons name="logo-apple" size={20} color={T.text.secondary} />
              <Text
                style={{
                  color: T.text.secondary,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign up link */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingBottom: 40,
            }}
          >
            <Text
              style={{ color: T.text.muted, fontSize: 14, fontWeight: "500" }}
            >
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text
                style={{
                  color: T.accent.purpleLight,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
