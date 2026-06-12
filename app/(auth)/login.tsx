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
      className="flex-1 bg-lumina-bg-primary"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-8 pt-16">
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} className="mb-8">
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          {/* Header */}
          <Text className="text-lumina-text-primary text-3xl font-bold mb-2">Welcome back</Text>
          <Text className="text-lumina-text-secondary text-base mb-8">
            Sign in to continue to Lumina
          </Text>

          {/* Error */}
          {errors.general && (
            <View className="bg-lumina-accent-coral/10 border border-lumina-accent-coral/20 rounded-xl px-4 py-3 mb-4">
              <Text className="text-lumina-accent-coral text-sm">{errors.general}</Text>
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

          <Button title="Sign In" onPress={handleLogin} loading={loading} className="mt-2" />

          {/* Divider */}
          <View className="flex-row items-center gap-4 my-6">
            <View className="flex-1 h-px bg-lumina-text-muted/20" />
            <Text className="text-lumina-text-muted text-sm">or</Text>
            <View className="flex-1 h-px bg-lumina-text-muted/20" />
          </View>

          {/* Social */}
          <Button
            title="Continue with Google"
            onPress={handleGoogleLogin}
            variant="secondary"
            icon={<Ionicons name="logo-google" size={18} color="#A0A0B0" />}
          />

          <View className="h-4" />

          <Button
            title="Continue with Apple"
            onPress={handleAppleLogin}
            variant="secondary"
            icon={<Ionicons name="logo-apple" size={18} color="#A0A0B0" />}
          />

          {/* Sign up link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-lumina-text-secondary text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text className="text-lumina-accent-purple text-sm font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
