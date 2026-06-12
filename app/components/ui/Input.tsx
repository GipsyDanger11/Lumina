import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-lumina-text-secondary text-sm mb-1.5 font-medium">{label}</Text>
      <View
        className={`flex-row items-center bg-lumina-bg-card rounded-xl border ${
          isFocused ? "border-lumina-accent-purple" : error ? "border-lumina-accent-coral" : "border-lumina-text-muted/20"
        } px-4 py-3`}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className="flex-1 text-lumina-text-primary text-base"
          placeholderTextColor="#5A5A6E"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && <Text className="text-lumina-accent-coral text-xs mt-1">{error}</Text>}
    </View>
  );
}
