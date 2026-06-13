import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { T, S } from "../../lib/theme";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: T.text.secondary,
          fontSize: 14,
          marginBottom: 8,
          fontWeight: "600",
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: T.glass.bg,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: isFocused
            ? T.accent.purple
            : error
            ? T.accent.coral
            : T.glass.border,
          paddingHorizontal: 16,
          paddingVertical: 14,
          ...(isFocused
            ? {
                ...S.shadow(4, T.accent.purple),
              }
            : {}),
        }}
      >
        {icon && (
          <View
            style={{
              marginRight: 12,
              opacity: isFocused ? 1 : 0.5,
            }}
          >
            {icon}
          </View>
        )}
        <TextInput
          style={{
            flex: 1,
            color: T.text.primary,
            fontSize: 16,
            fontWeight: "500",
          }}
          placeholderTextColor={T.text.muted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && (
        <Text
          style={{
            color: T.accent.coral,
            fontSize: 12,
            marginTop: 6,
            fontWeight: "500",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}