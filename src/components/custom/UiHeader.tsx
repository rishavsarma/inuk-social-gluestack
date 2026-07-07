import { ROUTES } from "@/routes";
import { useSettingStore } from "@/stores/setting.store";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export interface HeaderProps {
  title?: string;
  scrollY?: SharedValue<number>;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backAction?: "back" | "home" | (string & {});
  logoSize?: "large" | "small" | "none";
  rightElement?: React.ReactNode;
  customBackButton?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  topInset?: number;
  blurTint?: "light" | "dark" | "default" | "prominent" | "regular";
  blurIntensity?: number;
  hideBorder?: boolean;
  backgroundColor?: string;
  transparent?: boolean;
}

export function UiHeader({
  title = "",
  scrollY,
  showBackButton = true,
  onBackPress,
  backAction = "back",
  logoSize = "large",
  rightElement,
  customBackButton,
  className,
  titleClassName,
  topInset = 0,
  blurTint,
  blurIntensity,
  hideBorder = false,
  backgroundColor,
  transparent = false,
}: HeaderProps) {
  const { theme } = useSettingStore();
  const isDark = theme === "dark";

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    if (backAction === "home") {
      router.replace(ROUTES.AUTH.HOME);
    } else if (backAction === "back") {
      router.back();
    } else {
      router.replace(backAction as any);
    }
  };

  const navBarStyle = useAnimatedStyle(() => {
    if (transparent) return { opacity: 0 };
    if (!scrollY) return { opacity: 1 };
    return {
      opacity: interpolate(
        scrollY.value,
        [40, 80],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    if (!scrollY) return { opacity: 1, transform: [{ translateY: 0 }] };
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 200],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      // transform: [
      //   {
      //     translateY: interpolate(scrollY.value, [0, 10], [0, -10], Extrapolation.CLAMP),
      //   },
      // ],
    };
  });

  return (
    <>
      {/* ── Sticky nav bar (fades in on scroll) ──────────────── */}
      <Animated.View
        style={[
          navBarStyle,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            borderBottomWidth: hideBorder ? 0 : StyleSheet.hairlineWidth,
            paddingTop: topInset > 0 ? topInset : 8,
            backgroundColor:
              backgroundColor ??
              Platform.select({
                android: isDark
                  ? "rgba(0, 0, 0, 0.9)"
                  : "rgba(255, 255, 255, 0.8)",
                default: "transparent",
              }),
          },
        ]}
        className={cn(
          "border-black/8 px-4 pb-2 dark:border-white/8",
          className,
        )}
      >
        {!backgroundColor && (
          <BlurView
            intensity={blurIntensity ?? (Platform.OS === "android" ? 100 : 80)}
            tint={blurTint ?? (isDark ? "dark" : "light")}
            style={StyleSheet.absoluteFill}
          />
        )}
      </Animated.View>

      {/* ── Static Back Button ──────────────── */}
      {showBackButton && scrollY ? (
        <Animated.View
          style={[
            logoStyle,
            {
              position: "absolute",
              top: topInset > 0 ? topInset : 8,
              left: 16,
              zIndex: 60,
            },
          ]}
        ></Animated.View>
      ) : null}
    </>
  );
}
