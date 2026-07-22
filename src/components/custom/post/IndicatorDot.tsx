import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export function IndicatorDot({ isActive }: { isActive: boolean }) {
  const animStyle = useAnimatedStyle(() => ({
    width: withTiming(isActive ? 16 : 5, { duration: 150 }),
    backgroundColor: withTiming(
      isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
      {
        duration: 150,
      },
    ),
  }));

  return <Animated.View className="h-1.5 rounded-full" style={animStyle} />;
}
