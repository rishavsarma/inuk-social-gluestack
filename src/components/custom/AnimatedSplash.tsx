import React, { useEffect, useState } from "react";

import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LogoIcon, LogoWordmark } from "@/components/custom/Logo";
import { POST_CONSTANTS } from "@/constants";

const ICON_SIZE = 44;
const ICON_SCALE_UP = 1.8;
const ICON_ROTATE_DEG = 10;
const GLOW_SIZE = ICON_SIZE * 1.7;
const GLOW_MAX_OPACITY = 0.35;
const ENTRANCE_MS = 500;
const HOLD_MS = 1400;
const POP_MS = 500;
const POP_HOLD_MS = 700;

function AnimatedSplash() {
  const [rowX, setRowX] = useState<number | null>(null);

  const entranceOpacity = useSharedValue(0);
  const entranceScale = useSharedValue(0.85);

  const iconScale = useSharedValue(1);
  const iconTranslateX = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(1);
  const textTranslateY = useSharedValue(0);

  useEffect(() => {
    // Hide the native splash only once this screen has actually painted,
    // so there's no gap between the native splash and this one.
    SplashScreen.hideAsync();

    const easeOutEntrance = Easing.out(Easing.back(1.2));
    entranceOpacity.value = withTiming(1, { duration: ENTRANCE_MS });
    entranceScale.value = withTiming(1, {
      duration: ENTRANCE_MS,
      easing: easeOutEntrance,
    });
  }, [entranceOpacity, entranceScale]);

  useEffect(() => {
    if (rowX === null) return;

    const targetX = POST_CONSTANTS.SCREEN_WIDTH / 2 - rowX - ICON_SIZE / 2;
    const easeOut = Easing.out(Easing.cubic);
    const easeIn = Easing.inOut(Easing.cubic);

    iconScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: HOLD_MS }),
        withTiming(ICON_SCALE_UP, { duration: POP_MS, easing: easeOut }),
        withTiming(ICON_SCALE_UP, { duration: POP_HOLD_MS }),
        withTiming(1, { duration: POP_MS, easing: easeIn })
      ),
      -1
    );

    iconTranslateX.value = withRepeat(
      withSequence(
        withTiming(0, { duration: HOLD_MS }),
        withTiming(targetX, { duration: POP_MS, easing: easeOut }),
        withTiming(targetX, { duration: POP_HOLD_MS }),
        withTiming(0, { duration: POP_MS, easing: easeIn })
      ),
      -1
    );

    iconRotate.value = withRepeat(
      withSequence(
        withTiming(0, { duration: HOLD_MS }),
        withTiming(-ICON_ROTATE_DEG, { duration: POP_MS, easing: easeOut }),
        withTiming(ICON_ROTATE_DEG, { duration: POP_HOLD_MS, easing: easeIn }),
        withTiming(0, { duration: POP_MS, easing: easeIn })
      ),
      -1
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: HOLD_MS }),
        withTiming(1.5, { duration: POP_MS, easing: easeOut }),
        withTiming(1.5, { duration: POP_HOLD_MS }),
        withTiming(1, { duration: POP_MS, easing: easeIn })
      ),
      -1
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: HOLD_MS }),
        withTiming(GLOW_MAX_OPACITY, { duration: POP_MS, easing: easeOut }),
        withTiming(GLOW_MAX_OPACITY, { duration: POP_HOLD_MS }),
        withTiming(0, { duration: POP_MS, easing: easeIn })
      ),
      -1
    );

    textOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: HOLD_MS }),
        withTiming(0, { duration: POP_MS * 0.6 }),
        withTiming(0, { duration: POP_MS * 0.4 + POP_HOLD_MS }),
        withTiming(1, { duration: POP_MS })
      ),
      -1
    );

    textTranslateY.value = withRepeat(
      withSequence(
        withTiming(0, { duration: HOLD_MS }),
        withTiming(-8, { duration: POP_MS, easing: easeOut }),
        withTiming(-8, { duration: POP_HOLD_MS }),
        withTiming(0, { duration: POP_MS, easing: easeIn })
      ),
      -1
    );
  }, [
    rowX,
    iconScale,
    iconTranslateX,
    iconRotate,
    glowScale,
    glowOpacity,
    textOpacity,
    textTranslateY,
  ]);

  const entranceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ scale: entranceScale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: iconTranslateX.value },
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Animated.View
        className="flex-row items-center gap-2"
        style={entranceAnimatedStyle}
        onLayout={(e) => setRowX(e.nativeEvent.layout.x)}
      >
        <Animated.View
          className="items-center justify-center"
          style={iconAnimatedStyle}
        >
          <Animated.View
            className="absolute rounded-full bg-theme"
            style={[
              { width: GLOW_SIZE, height: GLOW_SIZE },
              glowAnimatedStyle,
            ]}
          />
          <LogoIcon size={ICON_SIZE} />
        </Animated.View>
        <Animated.View style={textAnimatedStyle}>
          <LogoWordmark />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default AnimatedSplash;
