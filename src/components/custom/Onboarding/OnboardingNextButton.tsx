import { ArrowRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { FlatList } from "react-native";
import Animated, {
  AnimatedRef,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { THEME_ACCENT_COLOR } from "@/constants";
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

  const buttonAnimationStyle = useAnimatedStyle(() => ({
    width: flatListIndex.value === dataLength - 1 ? withTiming(150) : withTiming(60),
    height: 60,
  }));

  const arrowAnimationStyle = useAnimatedStyle(() => ({
    opacity: flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
    transform: [
      {
        translateX: flatListIndex.value === dataLength - 1 ? withTiming(100) : withTiming(0),
      },
    ],
  }));

  const textAnimationStyle = useAnimatedStyle(() => ({
    opacity: flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
    transform: [
      {
        translateX: flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(-100),
      },
    ],
  }));

  const handlePress = () => {
    if (flatListIndex.value < dataLength - 1) {
      flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 });
    } else {
      onFinish();
    }
  };

  return (
    <Pressable onPress={handlePress} accessibilityRole="button">
      <Animated.View
        className="items-center justify-center overflow-hidden rounded-full"
        style={[
          buttonAnimationStyle,
          {
            backgroundColor: THEME_ACCENT_COLOR,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 6,
          },
        ]}
      >
        <Animated.Text
          style={[textAnimationStyle, { letterSpacing: 0.3, position: "absolute" }]}
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
