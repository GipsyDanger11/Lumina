import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { auth, signInWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithRedirect } from "../lib/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be 6+ characters";
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
      style={{ flex: 1, backgroundColor: "#0A0A0F" }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 64 }}>
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 32 }}>
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          {/* Header */}
          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginBottom: 8 }}>Welcome back</Text>
          <Text style={{ color: "#A0A0B0", fontSize: 16, marginBottom: 32 }}>
            Sign in to continue to Lumina
          </Text>

          {/* Error */}
          {errors.general && (
            <View style={{ backgroundColor: "rgba(255, 107, 107, 0.1)", borderWidth: 1, borderColor: "rgba(255, 107, 107, 0.2)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontSize: 14 }}>{errors.general}</Text>
            </View>
          )}

          {/* Form */}
          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
          />

          <Button title="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

          {/* Divider */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginVertical: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(90, 90, 110, 0.2)" }} />
            <Text style={{ color: "#5A5A6E", fontSize: 14 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(90, 90, 110, 0.2)" }} />
          </View>

          {/* Social */}
          <Button
            title="Continue with Google"
            onPress={handleGoogleLogin}
            variant="secondary"
            icon={<Ionicons name="logo-google" size={18} color="#A0A0B0" />}
          />

          <View style={{ height: 16 }} />

          <Button
            title="Continue with Apple"
            onPress={handleAppleLogin}
            variant="secondary"
            icon={<Ionicons name="logo-apple" size={18} color="#A0A0B0" />}
          />

          {/* Sign up link */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 32 }}>
            <Text style={{ color: "#A0A0B0", fontSize: 14 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={{ color: "#7C6FF7", fontSize: 14, fontWeight: "600" }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
