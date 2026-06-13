import React, { useRef } from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { T, S } from "../../lib/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const sizeStyle =
    size === "sm"
      ? { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 }
      : size === "lg"
      ? { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 20 }
      : { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 };

  const textSize =
    size === "sm"
      ? { fontSize: 14 }
      : size === "lg"
      ? { fontSize: 18 }
      : { fontSize: 16 };

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[style]}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <LinearGradient
            colors={T.gradient.purple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              sizeStyle,
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                ...S.shadow(6, T.accent.purple),
              },
              disabled ? { opacity: 0.5 } : {},
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                <Text
                  style={[
                    {
                      color: "#FFFFFF",
                      fontWeight: "700",
                      letterSpacing: 0.3,
                    },
                    textSize,
                  ]}
                >
                  {title}
                </Text>
              </>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[style]}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View
            style={[
              sizeStyle,
              {
                backgroundColor: T.bg.card,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: T.glass.border,
              },
              disabled ? { opacity: 0.5 } : {},
            ]}
          >
            {loading ? (
              <ActivityIndicator color={T.accent.purple} size="small" />
            ) : (
              <>
                {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                <Text
                  style={[
                    {
                      color: T.text.primary,
                      fontWeight: "600",
                    },
                    textSize,
                  ]}
                >
                  {title}
                </Text>
              </>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[style]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View
          style={[
            sizeStyle,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            },
            disabled ? { opacity: 0.5 } : {},
          ]}
        >
          {loading ? (
            <ActivityIndicator color={T.accent.purple} size="small" />
          ) : (
            <>
              {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
              <Text
                style={[
                  {
                    color: T.accent.purple,
                    fontWeight: "600",
                  },
                  textSize,
                ]}
              >
                {title}
              </Text>
            </>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}