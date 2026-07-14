import { useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { HStack } from "@/components/ui/hstack";
import type { OnboardingSlide } from "@/constants/onboarding";

type DotProps = {
  index: number;
  x: SharedValue<number>;
};

function Dot({ index, x }: DotProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const animatedDotStyle = useAnimatedStyle(() => {
    const width = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [8, 24, 8],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0.35, 1, 0.35],
      Extrapolation.CLAMP,
    );
    return { width, opacity };
  });

  return (
    <Animated.View className="h-2 mx-1 rounded-full bg-theme" style={animatedDotStyle} />
  );
}

type OnboardingPaginationProps = {
  data: OnboardingSlide[];
  x: SharedValue<number>;
};

export function OnboardingPagination({ data, x }: OnboardingPaginationProps) {
  return (
    <HStack className="h-10 items-center justify-center">
      {data.map((_, index) => (
        <Dot key={index} index={index} x={x} />
      ))}
    </HStack>
  );
}
