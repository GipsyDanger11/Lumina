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
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: "#A0A0B0", fontSize: 14, marginBottom: 6, fontWeight: "500" }}>{label}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#1A1A24",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isFocused ? "#7C6FF7" : error ? "#FF6B6B" : "rgba(90, 90, 110, 0.2)",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        {icon && <View style={{ marginRight: 12 }}>{icon}</View>}
        <TextInput
          style={{ flex: 1, color: "#FFFFFF", fontSize: 16 }}
          placeholderTextColor="#5A5A6E"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={{ color: "#FF6B6B", fontSize: 12, marginTop: 4 }}>{error}</Text>}
    </View>
  );
}
