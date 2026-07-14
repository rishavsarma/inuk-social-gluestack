import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const PARTICLES = [
  { id: 0, xRatio: 0.12, size: 4, duration: 3800, delay: 0 },
  { id: 1, xRatio: 0.28, size: 3, duration: 5200, delay: 900 },
  { id: 2, xRatio: 0.5, size: 5, duration: 4400, delay: 400 },
  { id: 3, xRatio: 0.68, size: 3, duration: 6000, delay: 1400 },
  { id: 4, xRatio: 0.82, size: 4, duration: 4800, delay: 700 },
];

type ParticleProps = {
  xRatio: number;
  size: number;
  duration: number;
  delay: number;
  screenW: number;
  screenH: number;
  color: string;
  isActive: boolean;
};

export function Particle({
  xRatio,
  size,
  duration,
  delay,
  screenW,
  screenH,
  color,
  isActive,
}: ParticleProps) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.85, {
              duration: duration * 0.3,
              easing: Easing.out(Easing.quad),
            }),
            withTiming(0.4, { duration: duration * 0.4 }),
            withTiming(0, {
              duration: duration * 0.3,
              easing: Easing.in(Easing.quad),
            }),
          ),
          -1,
          false,
        ),
      );
      ty.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-screenH * 0.3, {
              duration,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(0, { duration: 0 }),
          ),
          -1,
          false,
        ),
      );
    } else {
      opacity.value = withTiming(0, { duration: 250 });
      ty.value = withTiming(0, { duration: 250 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [isActive, delay, duration, screenH]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: "absolute",
          left: xRatio * screenW - size / 2,
          bottom: screenH * 0.18,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: size * 2,
        },
      ]}
    />
  );
}
