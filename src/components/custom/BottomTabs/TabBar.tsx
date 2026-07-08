import { Icon } from "@/components/ui/icon";
import { useAppBottomInset } from "@/hooks/useAppInsets";
import { ROUTES } from "@/routes";
import { useSettingStore } from "@/stores/setting.store";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { GlassView } from "expo-glass-effect";
import { usePathname, useRouter } from "expo-router";
import { Gamepad2, Home, Plus, Trophy, User } from "lucide-react-native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTabBar } from "./TabBarContext";

// ─── Tab definitions ─────────────────────────────────────────────────
export const TABS = [
  { name: "feed", href: ROUTES.TABS.FEED, icon: Home, label: "Home" },
  {
    name: "contest",
    href: ROUTES.TABS.CONTEST,
    icon: Gamepad2,
    label: "Contest",
  },
  { name: "create", href: ROUTES.TABS.CREATE, icon: Plus, label: "" },
  { name: "awards", href: ROUTES.TABS.AWARDS, icon: Trophy, label: "Awards" },
  {
    name: "profile",
    href: ROUTES.TABS.PROFILE,
    icon: User,
    label: "Profile",
  },
];

const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const DURATION = 220;

// ─── Single tab item ─────────────────────────────────────────────────
function TabItem({
  tab,
  isActive,
  isDark,
  onPress,
}: {
  tab: (typeof TABS)[0];
  isActive: boolean;
  isDark: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(isActive ? 1 : 0);
  const scale = useSharedValue(1);
  const scaleRef = React.useRef(scale);
  const { t } = useTranslation();

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, {
      duration: DURATION,
      easing: EASE,
    });
  }, [isActive, progress]);

  const activeIconStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const inactiveIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scaleRef.current.value = withTiming(0.92, { duration: 100 });
  };

  const onPressOut = () => {
    scaleRef.current.value = withTiming(1, { duration: 100 });
  };

  const isCreate = tab.name === "create";

  if (isCreate) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="flex-1 items-center justify-center"
      >
        <Animated.View style={pressStyle}>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-theme">
            <Icon as={Plus} className="size-6 text-white" />
          </View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className="h-14 flex-1 items-center justify-center"
    >
      <Animated.View style={pressStyle} className="items-center">
        {/* Crossfading icon — opacity driven by Reanimated, position by Nativewind */}
        <View className="h-5.5 w-5.5">
          <Animated.View style={inactiveIconStyle} className="absolute inset-0">
            <Icon as={tab.icon} className="size-5 text-foreground/60" />
          </Animated.View>
          <Animated.View style={activeIconStyle} className="absolute inset-0">
            <Icon as={tab.icon} className="size-5 text-theme" />
          </Animated.View>
        </View>

        {/* Label */}
        <Text
          className={cn(
            "text-xs pt-1 leading-3 tracking-wide",
            isActive
              ? "font-bold text-theme"
              : "font-medium text-foreground/60",
          )}
        >
          {tab.label ? t(`tabs.${tab.name}`) : ""}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Custom tab bar ──────────────────────────────────────────────────
export default function CustomTabBar() {
  const theme = useSettingStore((state) => state.theme);
  const isDark = theme === "dark";
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const bottomInset = useAppBottomInset();

  const tabBarState = useTabBar();
  const dummyTranslateY = useSharedValue(0);
  const activeTranslateY = tabBarState.isInsideTabBar
    ? tabBarState.tabBarTranslateY
    : dummyTranslateY;
  const tabBarTranslateYRef = React.useRef(activeTranslateY);
  useEffect(() => {
    tabBarTranslateYRef.current = activeTranslateY;
  }, [activeTranslateY]);

  const activeIndex = TABS.findIndex((t) => pathname.startsWith(t.href));
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  // Sliding Indicator Logic
  const TAB_BAR_WIDTH = width - 32; // left: 16, right: 16
  const CONTENT_WIDTH = TAB_BAR_WIDTH - 12; // px-1.5 is 6px padding on each side
  const TAB_WIDTH = CONTENT_WIDTH / TABS.length;

  const indicatorPosition = useSharedValue(safeIndex * TAB_WIDTH);

  useEffect(() => {
    indicatorPosition.value = withTiming(safeIndex * TAB_WIDTH, {
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    // Reset tab bar visibility when switching tabs
    tabBarTranslateYRef.current.value = withTiming(0, {
      duration: 250,
      easing: EASE,
    });
  }, [safeIndex, TAB_WIDTH, indicatorPosition]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  const containerStyle = {
    position: "absolute" as const,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const barStyle = {
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 30 : bottomInset,
    borderRadius: 9999,
    overflow: "hidden" as const,
    borderWidth: 0.1,
    borderColor: isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)",
    backgroundColor:
      Platform.OS === "ios"
        ? isDark
          ? "rgba(0,0,0,0.95)"
          : "rgba(245,245,247,0.95)"
        : isDark
          ? "rgba(14,14,14,0.96)"
          : "rgba(245,245,247,0.96)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 32,
    shadowOpacity: isDark ? 0.6 : 0.14,
    elevation: 180,
  };

  // Animated wrapper — slides the whole pill up/down
  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslateYRef.current.value }],
  }));

  if (!tabBarState.isInsideTabBar) {
    return null;
  }
  const { setPreviousTab } = tabBarState;

  if (pathname.startsWith("/create") || pathname.startsWith("/explore"))
    return null;

  const content = (
    <View className="relative flex-row px-1.5 py-1">
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 4,
            bottom: 4,
            left: 6, // account for px-1.5
            width: TAB_WIDTH,
            borderRadius: 9999,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.05)",
          },
          indicatorStyle,
        ]}
      />
      {TABS.map((tab, i) => (
        <TabItem
          key={tab.name}
          tab={tab}
          isActive={i === safeIndex}
          isDark={isDark}
          onPress={() => {
            if (i !== safeIndex) {
              setPreviousTab(TABS[safeIndex].href);
            }
            router.push({
              pathname: tab.href,
              params: { tab: tab.name },
            } as any);
          }}
        />
      ))}
    </View>
  );

  const bar =
    Platform.OS === "ios" ? (
      <GlassView isInteractive style={barStyle} glassEffectStyle="regular">
        {content}
      </GlassView>
    ) : (
      <View style={barStyle}>{content}</View>
    );

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[slideStyle, containerStyle]}
    >
      {bar}
    </Animated.View>
  );
}
