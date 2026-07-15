import React, { useEffect, useState } from "react";

import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { LogoIcon } from "@/components/custom/Logo";
import { useAppBottomInset } from "@/hooks/useAppInsets";
import { THEME_ACCENT_COLOR } from "@/constants";

const ICON_SIZE = 44;
const ICON_ENTRANCE_MS = 450;
const TYPE_START_DELAY_MS = 250;
const TYPE_LETTER_MS = 90;
const SECONDARY_DELAY_AFTER_TYPING_MS = 300;
const SECONDARY_MS = 450;
const DOT_PULSE_MS = 400;
const DOT_HOLD_MS = 800;
const DOT_STAGGER_MS = 200;

/** "social" split into the two-tone wordmark — "soc" in foreground, "ial"
 * underlined in the theme accent — revealed letter by letter. */
const WORDMARK = ["s", "o", "c", "i", "a", "l"] as const;
const WORDMARK_SPLIT = 3;

/** Soft radial wash behind the logo — barely-there in light mode, a visible
 * glow against the near-black background in dark mode. */
function SplashGlow() {
  const { colorScheme } = useColorScheme();
  const maxOpacity = colorScheme === "dark" ? 0.45 : 0.12;

  return (
    <Svg
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="splashGlow" cx="50%" cy="42%" r="60%">
          <Stop
            offset="0%"
            stopColor={THEME_ACCENT_COLOR}
            stopOpacity={maxOpacity}
          />
          <Stop offset="100%" stopColor={THEME_ACCENT_COLOR} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#splashGlow)" />
    </Svg>
  );
}

/** Three-dot loading indicator — brightens in sequence to read as "in
 * progress" while auth state hydrates. Decorative, hidden from screen readers. */
function LoadingDots() {
  const dot0 = useSharedValue(0.25);
  const dot1 = useSharedValue(0.25);
  const dot2 = useSharedValue(0.25);

  useEffect(() => {
    const pulse = (dot: typeof dot0, delay: number) => {
      dot.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: DOT_PULSE_MS }),
            withTiming(0.25, { duration: DOT_PULSE_MS }),
            withTiming(0.25, { duration: DOT_HOLD_MS }),
          ),
          -1,
        ),
      );
    };
    pulse(dot0, 0);
    pulse(dot1, DOT_STAGGER_MS);
    pulse(dot2, DOT_STAGGER_MS * 2);
  }, [dot0, dot1, dot2]);

  const dot0Style = useAnimatedStyle(() => ({ opacity: dot0.value }));
  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));

  return (
    <View
      className="flex-row items-center gap-1.5"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        className="h-1.5 w-1.5 rounded-full bg-theme"
        style={dot0Style}
      />
      <Animated.View
        className="h-1.5 w-1.5 rounded-full bg-theme"
        style={dot1Style}
      />
      <Animated.View
        className="h-1.5 w-1.5 rounded-full bg-theme"
        style={dot2Style}
      />
    </View>
  );
}

/** Reveals "social" one letter at a time once `active` flips true, keeping
 * the existing foreground/theme two-tone split intact as it types. */
function TypewriterWordmark({
  active,
  onDone,
}: {
  active: boolean;
  onDone: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!active || visibleCount >= WORDMARK.length) return;
    const timer = setTimeout(
      () => setVisibleCount((count) => count + 1),
      TYPE_LETTER_MS,
    );
    return () => clearTimeout(timer);
  }, [active, visibleCount]);

  useEffect(() => {
    if (active && visibleCount === WORDMARK.length) onDone();
  }, [active, visibleCount, onDone]);

  const foreground = WORDMARK.slice(0, WORDMARK_SPLIT)
    .map((letter, i) => (i < visibleCount ? letter : ""))
    .join("");
  const accent = WORDMARK.slice(WORDMARK_SPLIT)
    .map((letter, i) => (WORDMARK_SPLIT + i < visibleCount ? letter : ""))
    .join("");

  return (
    <HStack className="items-center">
      <Heading
        size="3xl"
        className="font-baloo-extrabold font-normal text-foreground leading-none tracking-tight"
      >
        {foreground}
      </Heading>
      <Heading
        size="3xl"
        className="font-baloo-extrabold font-normal underline text-theme leading-none tracking-tight"
      >
        {accent}
      </Heading>
    </HStack>
  );
}

function AnimatedSplash() {
  const { t } = useTranslation();
  const bottomInset = useAppBottomInset();

  const [typingActive, setTypingActive] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.85);
  const secondaryOpacity = useSharedValue(0);
  const immediateOpacity = useSharedValue(0);

  useEffect(() => {
    // Hide the native splash only once this screen has actually painted,
    // so there's no gap between the native splash and this one.
    SplashScreen.hideAsync();

    const easeOutEntrance = Easing.out(Easing.back(1.2));
    iconOpacity.value = withTiming(1, { duration: ICON_ENTRANCE_MS });
    iconScale.value = withTiming(1, {
      duration: ICON_ENTRANCE_MS,
      easing: easeOutEntrance,
    });
    // Dots and brand label fade in right away, independent of the wordmark
    // typing sequence, so they read as soon as the splash paints.
    immediateOpacity.value = withTiming(1, { duration: SECONDARY_MS });

    const timer = setTimeout(
      () => setTypingActive(true),
      ICON_ENTRANCE_MS + TYPE_START_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [iconOpacity, iconScale, immediateOpacity]);

  useEffect(() => {
    if (!typingDone) return;
    secondaryOpacity.value = withDelay(
      SECONDARY_DELAY_AFTER_TYPING_MS,
      withTiming(1, { duration: SECONDARY_MS }),
    );
  }, [typingDone, secondaryOpacity]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const secondaryAnimatedStyle = useAnimatedStyle(() => ({
    opacity: secondaryOpacity.value,
  }));

  const immediateAnimatedStyle = useAnimatedStyle(() => ({
    opacity: immediateOpacity.value,
  }));

  return (
    <View className="flex-1 bg-background">
      <SplashGlow />

      <View className="flex-1 items-center justify-center gap-3">
        <Animated.View
          className="flex-row items-center gap-2"
          layout={LinearTransition.duration(150)}
        >
          <Animated.View style={iconAnimatedStyle}>
            <LogoIcon size={ICON_SIZE} />
          </Animated.View>
          <TypewriterWordmark
            active={typingActive}
            onDone={() => setTypingDone(true)}
          />
        </Animated.View>

        <Animated.View style={secondaryAnimatedStyle}>
          <Heading
            size="sm"
            className="font-baloo-bold font-normal text-foreground tracking-tight text-center"
          >
            {t("splash.tagline")}
          </Heading>
        </Animated.View>
      </View>

      <Animated.View
        className="items-center pb-8"
        style={immediateAnimatedStyle}
      >
        <LoadingDots />
      </Animated.View>

      <Animated.View
        className="items-center"
        style={[immediateAnimatedStyle, { paddingBottom: bottomInset + 16 }]}
      >
        <Text className="font-baloo-semibold font-normal text-muted-foreground text-xs uppercase tracking-widest">
          {t("splash.brand_label")}
        </Text>
      </Animated.View>
    </View>
  );
}

export default AnimatedSplash;
