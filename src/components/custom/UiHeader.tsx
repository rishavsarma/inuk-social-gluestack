import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

const BACK_BUTTON_SIZE = 40;
const BAR_VERTICAL_PADDING = 8;

/** Total height of the sticky nav bar (top padding + content + bottom padding).
 * Use this to pad content when `alwaysShowBar` keeps the bar permanently visible,
 * so it doesn't sit underneath it. */
export function getHeaderBarHeight(topInset: number = 0) {
  return (
    (topInset > 0 ? topInset : BAR_VERTICAL_PADDING) +
    BACK_BUTTON_SIZE +
    BAR_VERTICAL_PADDING
  );
}

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
  /** Keep the blurred bar + title permanently visible instead of only fading in on scroll. */
  alwaysShowBar?: boolean;
}

export function UiHeader({
  title = "",
  scrollY,
  showBackButton = true,
  onBackPress,
  backAction = "back",
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
  alwaysShowBar = false,
}: HeaderProps) {
  const isDark = useIsDarkMode();
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    if (backAction === "home") {
      router.replace(ROUTES.AUTH.HOME);
    } else if (backAction === "back") {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(isAuthenticated ? ROUTES.TABS.FEED : ROUTES.AUTH.HOME);
      }
    } else {
      router.replace(backAction as any);
    }
  };

  const navBarStyle = useAnimatedStyle(() => {
    if (transparent) return { opacity: 0 };
    if (alwaysShowBar || !scrollY) return { opacity: 1 };
    return {
      opacity: interpolate(
        scrollY.value,
        [40, 80],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <>
      {/* ── Sticky nav bar: blurs in and reveals the title on scroll ── */}
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
        pointerEvents="box-none"
      >
        {!backgroundColor && (
          <BlurView
            intensity={blurIntensity ?? (Platform.OS === "android" ? 100 : 80)}
            tint={blurTint ?? (isDark ? "dark" : "light")}
            style={StyleSheet.absoluteFill}
          />
        )}
        {showBackButton && (
          <HStack
            space="sm"
            className="min-h-10 items-center justify-between"
          >
            <Box className="h-10 w-10" />
            <Text
              numberOfLines={1}
              className={cn(
                "flex-1 text-center text-base font-bold text-foreground",
                titleClassName,
              )}
            >
              {title}
            </Text>
            <Box className="h-10 w-10 items-center justify-center">
              {rightElement}
            </Box>
          </HStack>
        )}
      </Animated.View>

      {/* ── Back button: floats above everything, always visible ── */}
      {showBackButton && (
        <Box
          pointerEvents="box-none"
          className="absolute left-4 z-60"
          style={{ top: topInset > 0 ? topInset : 8 }}
        >
          {customBackButton ?? (
            <Button
              variant="secondary"
              size="icon"
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel={t("common.go_back")}
              className="h-10 w-10 rounded-full opacity-90"
            >
              <ButtonIcon as={ArrowLeftIcon} size="lg" />
            </Button>
          )}
        </Box>
      )}
    </>
  );
}
