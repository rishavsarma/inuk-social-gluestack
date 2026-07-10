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
const HOLD_MS = 1400;
const POP_MS = 500;
const POP_HOLD_MS = 700;

function AnimatedSplash() {
  const [rowX, setRowX] = useState<number | null>(null);

  const iconScale = useSharedValue(1);
  const iconTranslateX = useSharedValue(0);
  const textOpacity = useSharedValue(1);

  useEffect(() => {
    // Hide the native splash only once this screen has actually painted,
    // so there's no gap between the native splash and this one.
    SplashScreen.hideAsync();
  }, []);

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

    textOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: HOLD_MS }),
        withTiming(0, { duration: POP_MS * 0.6 }),
        withTiming(0, { duration: POP_MS * 0.4 + POP_HOLD_MS }),
        withTiming(1, { duration: POP_MS })
      ),
      -1
    );
  }, [rowX, iconScale, iconTranslateX, textOpacity]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: iconTranslateX.value },
      { scale: iconScale.value },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View
        className="flex-row items-center gap-2"
        onLayout={(e) => setRowX(e.nativeEvent.layout.x)}
      >
        <Animated.View style={iconAnimatedStyle}>
          <LogoIcon size={ICON_SIZE} />
        </Animated.View>
        <Animated.View style={textAnimatedStyle}>
          <LogoWordmark />
        </Animated.View>
      </View>
    </View>
  );
}

export default AnimatedSplash;
