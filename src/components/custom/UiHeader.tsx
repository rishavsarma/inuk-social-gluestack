import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { ChevronLeft, SearchIcon, X } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, TextStyle, type StyleProp } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

const BACK_BUTTON_SIZE = 40;
const BAR_VERTICAL_PADDING = 8;
/** Keep in sync with the `showSearch` bar's `h-10` className below. */
export const SEARCH_BAR_HEIGHT = 40;

/** Total height of the sticky nav bar (top padding + content + bottom padding).
 * Use this to pad content when `alwaysShowBar` keeps the bar permanently visible,
 * so it doesn't sit underneath it. Pass `contentHeight` when the bar's row is
 * taller than the default (e.g. `SEARCH_BAR_HEIGHT` for `showSearch`). */
export function getHeaderBarHeight(
  topInset: number = 0,
  contentHeight: number = BACK_BUTTON_SIZE,
) {
  return (
    (topInset > 0 ? topInset : BAR_VERTICAL_PADDING) +
    contentHeight +
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
  /** Inline colour override for the title, e.g. a category's dynamic ink colour that
   * a static className can't express. Applied alongside titleClassName. */
  titleStyle?: StyleProp<TextStyle>;
  /** Rendered immediately before the title text, e.g. a category icon. */
  titleIcon?: React.ReactNode;
  /** Replaces the title row with a full-width search bar. By default this bar
   * navigates to the Explore/search screen when pressed; pass `onSearchChange`
   * to make it an editable input instead (e.g. on the Explore screen itself). */
  showSearch?: boolean;
  /** Placeholder text for the `showSearch` bar. Defaults to `t("search.placeholder")`. */
  searchPlaceholder?: string;
  /** Current text for the `showSearch` bar. Providing this (with `onSearchChange`)
   * switches the bar from a navigate-away button to an editable input. */
  searchValue?: string;
  /** Called as the user types in the `showSearch` bar. Its presence is what
   * switches the bar into editable-input mode. */
  onSearchChange?: (text: string) => void;
  /** Autofocuses the `showSearch` input when in editable mode. */
  searchAutoFocus?: boolean;
  /** Shows a small search icon button as `rightElement` that navigates to the
   * Explore/search screen — for use alongside a title/back button. Ignored if
   * `rightElement` is also passed, and has no effect when `showSearch` is set. */
  showSearchButton?: boolean;
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
  titleStyle,
  titleIcon,
  showSearch = false,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  searchAutoFocus = false,
  showSearchButton = false,
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

  const resolvedSearchPlaceholder =
    searchPlaceholder ?? t("search.placeholder");

  const resolvedRightElement =
    rightElement ??
    (showSearchButton ? (
      <Button
        variant="outline"
        size="icon"
        onPress={() => router.push(ROUTES.TABS.EXPLORE)}
        accessibilityRole="button"
        accessibilityLabel={t("search.title")}
        className="rounded-full"
      >
        <ButtonIcon as={SearchIcon} />
      </Button>
    ) : null);

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
        {(showBackButton || showSearch || showSearchButton || rightElement) && (
          <HStack space="sm" className="min-h-12 items-center">
            {showBackButton && <Box className="h-12 w-12" />}
            {showSearch ? (
              <Pressable
                className="flex-1"
                onPress={
                  onSearchChange
                    ? undefined
                    : () => router.push(ROUTES.TABS.EXPLORE)
                }
                accessibilityRole={onSearchChange ? undefined : "button"}
                accessibilityLabel={
                  onSearchChange ? undefined : resolvedSearchPlaceholder
                }
              >
                <Input
                  className="rounded-full  bg-card"
                  pointerEvents={onSearchChange ? "auto" : "none"}
                >
                  <InputSlot className="pl-2">
                    <InputIcon
                      as={SearchIcon}
                      className="h-5 w-5 text-muted-foreground"
                    />
                  </InputSlot>
                  <InputField
                    value={searchValue ?? ""}
                    onChangeText={onSearchChange}
                    editable={!!onSearchChange}
                    placeholder={resolvedSearchPlaceholder}
                    autoFocus={searchAutoFocus}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="search"
                    accessibilityLabel={resolvedSearchPlaceholder}
                    className="text-sm"
                  />
                  {onSearchChange && searchValue ? (
                    <InputSlot
                      onPress={() => onSearchChange("")}
                      accessibilityRole="button"
                      accessibilityLabel={t("search.clear")}
                      className="pr-4"
                    >
                      <Icon as={X} className="h-4 w-4 text-muted-foreground" />
                    </InputSlot>
                  ) : null}
                </Input>
              </Pressable>
            ) : (
              <>
                <HStack
                  space="xs"
                  className="flex-1 items-center font-baloo-bold justify-center"
                >
                  {titleIcon}
                  <Text
                    numberOfLines={1}
                    style={titleStyle}
                    className={cn(
                      "shrink text-center text-base font-baloo-bold text-foreground",
                      titleClassName,
                    )}
                  >
                    {title}
                  </Text>
                </HStack>
                <Box className="h-10 w-10 items-center justify-center">
                  {resolvedRightElement}
                </Box>
              </>
            )}
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
              className="h-12 w-12 rounded-full bg-card opacity-90"
            >
              <ButtonIcon as={ChevronLeft} size="lg" />
            </Button>
          )}
        </Box>
      )}
    </>
  );
}
