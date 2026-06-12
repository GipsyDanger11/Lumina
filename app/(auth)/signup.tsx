import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import {
  auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
} from "../lib/firebase";
import { migrateGuestData } from "../lib/guestMigration";
import { useUserStore } from "../store/useUserStore";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((s) => s.setUser);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name) errs.name = "Name is required";
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be 6+ characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
      // Migrate guest data
      await migrateGuestData(cred.user.uid);
      router.replace("/(onboarding)/method");
    } catch (error: any) {
      setErrors({ general: error.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setErrors({ general: error.message || "Google sign-up failed" });
    }
  };

  const handleAppleSignup = async () => {
    try {
      const provider = new OAuthProvider("apple.com");
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setErrors({ general: error.message || "Apple sign-up failed" });
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
          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginBottom: 8 }}>Create account</Text>
          <Text style={{ color: "#A0A0B0", fontSize: 16, marginBottom: 32 }}>
            Start your health journey with Lumina
          </Text>

          {/* Error */}
          {errors.general && (
            <View style={{ backgroundColor: "rgba(255, 107, 107, 0.1)", borderWidth: 1, borderColor: "rgba(255, 107, 107, 0.2)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 }}>
              <Text style={{ color: "#FF6B6B", fontSize: 14 }}>{errors.general}</Text>
            </View>
          )}

          {/* Form */}
          <Input
            label="Full Name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
          />

          <Button title="Create Account" onPress={handleSignup} loading={loading} style={{ marginTop: 8 }} />

          {/* Divider */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginVertical: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(90, 90, 110, 0.2)" }} />
            <Text style={{ color: "#5A5A6E", fontSize: 14 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(90, 90, 110, 0.2)" }} />
          </View>

          {/* Social */}
          <Button
            title="Continue with Google"
            onPress={handleGoogleSignup}
            variant="secondary"
            icon={<Ionicons name="logo-google" size={18} color="#A0A0B0" />}
          />

          <View style={{ height: 16 }} />

          <Button
            title="Continue with Apple"
            onPress={handleAppleSignup}
            variant="secondary"
            icon={<Ionicons name="logo-apple" size={18} color="#A0A0B0" />}
          />

          {/* Login link */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 32 }}>
            <Text style={{ color: "#A0A0B0", fontSize: 14 }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={{ color: "#7C6FF7", fontSize: 14, fontWeight: "600" }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
