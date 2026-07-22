import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { THEME_ACCENT_COLOR } from "@/constants";
import type { OnboardingFloatingCard } from "@/constants/onboarding";

const ICONS: Record<OnboardingFloatingCard["type"], { emoji: string; bg: string }> = {
  like: { emoji: "❤️", bg: THEME_ACCENT_COLOR },
  comment: { emoji: "💬", bg: "#3AAADC" },
  trophy: { emoji: "🏆", bg: "#F5A623" },
  stat: { emoji: "👑", bg: THEME_ACCENT_COLOR },
};

type FloatingCardViewProps = {
  card: OnboardingFloatingCard;
  screenW: number;
  screenH: number;
  accentColor: string;
  isActive: boolean;
};

export function FloatingCardView({
  card,
  screenW,
  screenH,
  accentColor,
  isActive,
}: FloatingCardViewProps) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(40);
  const scale = useSharedValue(0.82);
  const floatY = useSharedValue(0);

  const floatPeriod = 2400 + card.delay * 0.8;

  useEffect(() => {
    if (isActive) {
      opacity.value = withDelay(card.delay, withTiming(1, { duration: 380 }));
      ty.value = withDelay(card.delay, withSpring(0, { damping: 13, stiffness: 90 }));
      scale.value = withDelay(card.delay, withSpring(1, { damping: 12, stiffness: 100 }));

      floatY.value = withDelay(
        card.delay + 700,
        withRepeat(
          withSequence(
            withTiming(-9, { duration: floatPeriod, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: floatPeriod, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          true,
        ),
      );
    } else {
      opacity.value = withTiming(0, { duration: 180 });
      ty.value = withTiming(40, { duration: 200 });
      scale.value = withTiming(0.82, { duration: 180 });
      floatY.value = withTiming(0, { duration: 200 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [isActive, card.delay, floatPeriod]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: ty.value + floatY.value },
      { scale: scale.value },
      { rotate: `${card.rotate}deg` },
    ],
  }));

  const { emoji, bg } = ICONS[card.type];

  return (
    <Animated.View
      style={[
        cardStyle,
        {
          position: "absolute",
          left: card.x * screenW,
          top: card.y * screenH,
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
        },
      ]}
    >
      <HStack
        space="sm"
        className="items-center rounded-[22px] border border-white/15 bg-[#080401]/65 px-4 py-3"
      >
        <VStack
          style={{ backgroundColor: bg }}
          className="w-[30px] h-[30px] rounded-full items-center justify-center"
        >
          <Text className="text-sm">{emoji}</Text>
        </VStack>
        <VStack>
          <Text className="text-sm font-extrabold text-white tracking-wide">
            {card.value}
          </Text>
          {card.label && (
            <Text className="text-xs text-white/55">{card.label}</Text>
          )}
        </VStack>
      </HStack>
    </Animated.View>
  );
}
