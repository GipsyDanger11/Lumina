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
      className="flex-1 bg-lumina-bg-primary"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-8 pt-16">
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} className="mb-8">
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          {/* Header */}
          <Text className="text-lumina-text-primary text-3xl font-bold mb-2">Create account</Text>
          <Text className="text-lumina-text-secondary text-base mb-8">
            Start your health journey with Lumina
          </Text>

          {/* Error */}
          {errors.general && (
            <View className="bg-lumina-accent-coral/10 border border-lumina-accent-coral/20 rounded-xl px-4 py-3 mb-4">
              <Text className="text-lumina-accent-coral text-sm">{errors.general}</Text>
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

          <Button title="Create Account" onPress={handleSignup} loading={loading} className="mt-2" />

          {/* Divider */}
          <View className="flex-row items-center gap-4 my-6">
            <View className="flex-1 h-px bg-lumina-text-muted/20" />
            <Text className="text-lumina-text-muted text-sm">or</Text>
            <View className="flex-1 h-px bg-lumina-text-muted/20" />
          </View>

          {/* Social */}
          <Button
            title="Continue with Google"
            onPress={handleGoogleSignup}
            variant="secondary"
            icon={<Ionicons name="logo-google" size={18} color="#A0A0B0" />}
          />

          <View className="h-4" />

          <Button
            title="Continue with Apple"
            onPress={handleAppleSignup}
            variant="secondary"
            icon={<Ionicons name="logo-apple" size={18} color="#A0A0B0" />}
          />

          {/* Login link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-lumina-text-secondary text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-lumina-accent-purple text-sm font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
