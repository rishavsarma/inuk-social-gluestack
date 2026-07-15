import * as Haptics from "expo-haptics";
import { ArrowRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { FlatList } from "react-native";
import Animated, {
  AnimatedRef,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import type { OnboardingSlide } from "@/constants/onboarding";

type OnboardingNextButtonProps = {
  flatListRef: AnimatedRef<FlatList<OnboardingSlide>>;
  flatListIndex: SharedValue<number>;
  dataLength: number;
  onFinish: () => void;
};

export function OnboardingNextButton({
  flatListRef,
  flatListIndex,
  dataLength,
  onFinish,
}: OnboardingNextButtonProps) {
  const { t } = useTranslation();
  const pressScale = useSharedValue(1);

  const buttonAnimationStyle = useAnimatedStyle(() => ({
    width:
      flatListIndex.value === dataLength - 1
        ? withSpring(150, { damping: 15, stiffness: 140 })
        : withSpring(60, { damping: 15, stiffness: 140 }),
    height: 60,
    transform: [{ scale: pressScale.value }],
  }));

  const arrowAnimationStyle = useAnimatedStyle(() => ({
    opacity:
      flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
    transform: [
      {
        translateX:
          flatListIndex.value === dataLength - 1
            ? withSpring(100, { damping: 15, stiffness: 140 })
            : withSpring(0, { damping: 15, stiffness: 140 }),
      },
    ],
  }));

  const textAnimationStyle = useAnimatedStyle(() => ({
    opacity:
      flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
    transform: [
      {
        translateX:
          flatListIndex.value === dataLength - 1
            ? withSpring(0, { damping: 15, stiffness: 140 })
            : withSpring(-100, { damping: 15, stiffness: 140 }),
      },
    ],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (flatListIndex.value < dataLength - 1) {
      flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 });
    } else {
      onFinish();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => {
        pressScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      accessibilityRole="button"
    >
      <Animated.View
        className="bg-theme items-center justify-center overflow-hidden rounded-full"
        style={[buttonAnimationStyle]}
      >
        <Animated.Text
          style={[
            textAnimationStyle,
            { letterSpacing: 0.3, position: "absolute" },
          ]}
          className="text-base font-bold text-white"
        >
          {t("onboarding.get_started")}
        </Animated.Text>
        <Animated.View style={[arrowAnimationStyle, { position: "absolute" }]}>
          <Icon as={ArrowRight} size="lg" className="text-white" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
