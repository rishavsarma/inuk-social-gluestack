import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAppBottomInset } from "@/hooks/useAppInsets";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { buildImageUrl } from "@/utils/media";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import * as Haptics from "expo-haptics";
import { usePathname, useRouter } from "expo-router";
import { Compass, Gamepad2, Home, Plus, User } from "lucide-react-native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import GlassPillBar from "@/components/custom/GlassPillBar";

import { useTabBar } from "./TabBarContext";

// ─── Tab definitions ─────────────────────────────────────────────────
export const TABS = [
  { name: "feed", href: ROUTES.TABS.FEED, icon: Home, label: "Home" },
  {
    name: "discover",
    href: ROUTES.TABS.DISCOVER,
    icon: Compass,
    label: "Discover",
  },
  { name: "create", href: ROUTES.TABS.CREATE, icon: Plus, label: "" },
  {
    name: "arena",
    href: ROUTES.TABS.ARENA,
    icon: Gamepad2,
    label: "Arena",
  },
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

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const isCreate = tab.name === "create";
  const isProfile = tab.name === "profile";
  const label = t(`tabs.${tab.name}`);

  const avatarPath = useAuthStore((state) => state.user?.avatar);
  const avatarUrl = avatarPath ? buildImageUrl(avatarPath, 150) : null;

  if (isCreate) {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="flex-1 items-center justify-center"
      >
        <Animated.View style={pressStyle}>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-theme">
            <Icon as={Plus} size="xl" className=" text-white" />
          </View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
      className="h-14 flex-1 items-center justify-center"
    >
      <Animated.View
        style={pressStyle}
        className="items-center gap-1 justify-center"
      >
        <View className="h-5.5 w-5.5">
          {/* {isProfile && avatarUrl ? (
            <>
              <Animated.View
                style={inactiveIconStyle}
                className="absolute inset-0 items-center justify-center"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage source={{ uri: avatarUrl }} alt={label} />
                </Avatar>
              </Animated.View>
              <Animated.View
                style={activeIconStyle}
                className="absolute inset-0 rounded-full items-center justify-center"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage source={{ uri: avatarUrl }} alt={label} />
                </Avatar>
              </Animated.View>
            </>
          ) : ( */}
          {/* <> */}
          <Animated.View
            style={inactiveIconStyle}
            className="absolute inset-0 items-center justify-center"
          >
            <Icon as={tab.icon} className="text-foreground/60 h-6 w-6" />
          </Animated.View>
          <Animated.View
            style={activeIconStyle}
            className="absolute inset-0 items-center justify-center"
          >
            <Icon as={tab.icon} className="h-6  w-6 text-theme" />
          </Animated.View>
          {/* </> */}
          {/* )} */}
        </View>

        {/* Label */}
        <Text
          size="xs"
          className={cn(
            " pt-1 leading-3 tracking-wide",
            isActive
              ? "font-bold text-theme"
              : "font-medium text-foreground/60",
          )}
        >
          {tab.label ? label : ""}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Custom tab bar ──────────────────────────────────────────────────
export default function CustomTabBar() {
  const isDark = useIsDarkMode();
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
  const CONTENT_WIDTH = TAB_BAR_WIDTH - 16; // px-2 is 8px padding on each side
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
    <View className="relative flex-row px-2 py-1">
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 4,
            bottom: 4,
            left: 8, // account for px-2
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

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[slideStyle, containerStyle]}
    >
      <GlassPillBar isDark={isDark} bottomInset={bottomInset}>
        {content}
      </GlassPillBar>
    </Animated.View>
  );
}
