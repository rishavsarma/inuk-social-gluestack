"use client";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { styled } from "nativewind";

interface KeyboardAvoidingViewProps {
  children?: React.ReactNode;
  className?: string;
  keyboardVerticalOffset?: number;
  behavior?: "padding" | "height" | "position";
  style?: StyleProp<ViewStyle>;
}

const BaseKeyboardAvoidingView = ({
  children,
  keyboardVerticalOffset = 0,
  style,
  ...props
}: KeyboardAvoidingViewProps) => {
  const { height } = useReanimatedKeyboardAnimation();

  const animatedStyle = useAnimatedStyle(() => {
    const keyboardHeight = -height.value;
    const padding =
      keyboardHeight > 0 ? keyboardHeight + keyboardVerticalOffset : 0;

    return {
      paddingBottom: padding,
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

export const KeyboardAvoidingView = styled(BaseKeyboardAvoidingView, {
  className: "style",
});
