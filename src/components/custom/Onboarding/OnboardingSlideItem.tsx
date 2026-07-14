import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { LinearGradient } from "@/components/ui/linear-gradient";

import { FloatingCardView } from "@/components/custom/Onboarding/FloatingCardView";
import { Particle, PARTICLES } from "@/components/custom/Onboarding/Particle";
import { LogoIcon } from "@/components/custom/Logo";
import type { OnboardingSlide } from "@/constants/onboarding";

type OnboardingSlideItemProps = {
  index: number;
  x: SharedValue<number>;
  slide: OnboardingSlide;
};

export function OnboardingSlideItem({ index, x, slide }: OnboardingSlideItemProps) {
  const { width: W, height: H } = useWindowDimensions();
  const { t } = useTranslation();

  const logoOp = useSharedValue(0);
  const logoTx = useSharedValue(-28);

  const titleOp = useSharedValue(0);
  const titleSc = useSharedValue(1.08);
  const titleTy = useSharedValue(24);

  const accentW = useSharedValue(0);
  const accentOp = useSharedValue(0);

  const subOp = useSharedValue(0);
  const subTy = useSharedValue(20);

  const bgPanX = useSharedValue(0);
  const bgPanY = useSharedValue(0);

  const [activeState, setActiveState] = useState(false);

  const triggerIn = useCallback(() => {
    setActiveState(true);

    logoOp.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });
    logoTx.value = withSpring(0, { damping: 16, stiffness: 110 });

    titleOp.value = withDelay(
      140,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
    );
    titleSc.value = withDelay(
      140,
      withTiming(1.0, { duration: 520, easing: Easing.out(Easing.cubic) }),
    );
    titleTy.value = withDelay(140, withSpring(0, { damping: 18, stiffness: 100 }));

    accentOp.value = withDelay(380, withTiming(1, { duration: 200 }));
    accentW.value = withDelay(380, withSpring(44, { damping: 12, stiffness: 130 }));

    subOp.value = withDelay(520, withTiming(1, { duration: 460, easing: Easing.out(Easing.quad) }));
    subTy.value = withDelay(520, withSpring(0, { damping: 18, stiffness: 90 }));

    bgPanX.value = withRepeat(
      withSequence(
        withTiming(W * 0.022, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-W * 0.012, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    bgPanY.value = withRepeat(
      withSequence(
        withTiming(H * 0.012, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-H * 0.008, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [W, H]);

  const triggerOut = useCallback(() => {
    setActiveState(false);
    const f = (d: number) => ({ duration: d });

    logoOp.value = withTiming(0, f(140));
    logoTx.value = withTiming(-28, f(140));
    titleOp.value = withTiming(0, f(130));
    titleSc.value = withTiming(1.08, f(130));
    titleTy.value = withTiming(24, f(130));
    accentOp.value = withTiming(0, f(110));
    accentW.value = withTiming(0, f(120));
    subOp.value = withTiming(0, f(100));
    subTy.value = withTiming(20, f(110));
    bgPanX.value = withTiming(0, f(600));
    bgPanY.value = withTiming(0, f(600));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, []);

  useAnimatedReaction(
    () => Math.abs(x.value - index * W) < W * 0.45,
    (active, previous) => {
      if (active && !previous) {
        runOnJS(triggerIn)();
      } else if (!active && previous) {
        runOnJS(triggerOut)();
      }
    },
  );

  const bgAnim = useAnimatedStyle(() => {
    const parallaxX = interpolate(
      x.value,
      [(index - 1) * W, index * W, (index + 1) * W],
      [W * 0.2, 0, -W * 0.2],
      Extrapolation.CLAMP,
    );
    const parallaxS = interpolate(
      x.value,
      [(index - 1) * W, index * W, (index + 1) * W],
      [1.08, 1.0, 1.08],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { translateX: parallaxX + bgPanX.value },
        { translateY: bgPanY.value },
        { scale: parallaxS },
      ],
    };
  });

  const logoAnim = useAnimatedStyle(() => ({
    opacity: logoOp.value,
    transform: [{ translateX: logoTx.value }],
  }));
  const titleAnim = useAnimatedStyle(() => ({
    opacity: titleOp.value,
    transform: [{ scale: titleSc.value }, { translateY: titleTy.value }],
  }));
  const accentAnim = useAnimatedStyle(() => ({
    opacity: accentOp.value,
    width: accentW.value,
  }));
  const subAnim = useAnimatedStyle(() => ({
    opacity: subOp.value,
    transform: [{ translateY: subTy.value }],
  }));

  return (
    <Animated.View style={{ width: W, height: H }} className="overflow-hidden">
      <Animated.View style={bgAnim} className="absolute inset-0">
        <Image
          source={slide.backgroundImage}
          style={{ width: W * 1.4, height: H, marginLeft: -W * 0.2 }}
          contentFit="cover"
        />
      </Animated.View>

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]}
        locations={[0, 0.5, 1]}
        pointerEvents="none"
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
      />

      {PARTICLES.map((p) => (
        <Particle
          key={p.id}
          xRatio={p.xRatio}
          size={p.size}
          duration={p.duration}
          delay={p.delay}
          screenW={W}
          screenH={H}
          color={slide.accentColor}
          isActive={activeState}
        />
      ))}

      <Animated.View style={[logoAnim, { position: "absolute", left: 16, top: 80 }]}>
        <HStack space="sm" className="items-center">
          <LogoIcon size={44} />
          <HStack className="items-center">
            <Heading
              size="3xl"
              className="font-baloo-extrabold font-normal text-white leading-none tracking-tight"
            >
              soc
            </Heading>
            <Heading
              size="3xl"
              className="font-baloo-extrabold font-normal underline text-theme leading-none tracking-tight"
            >
              ial
            </Heading>
          </HStack>
        </HStack>
      </Animated.View>

      {slide.floatingCards.map((card) => (
        <FloatingCardView
          key={card.id}
          card={card}
          accentColor={slide.accentColor}
          screenW={W}
          screenH={H}
          isActive={activeState}
        />
      ))}

      <Animated.View
        pointerEvents="none"
        style={{ position: "absolute", bottom: 145, left: 0, right: 0, paddingHorizontal: 16 }}
      >
        <Animated.Text
          style={[
            titleAnim,
            {
              textShadowColor: "rgba(0,0,0,0.55)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 10,
              marginBottom: 12,
            },
          ]}
          className="text-[40px] font-black leading-[50px] tracking-[-0.8px] text-white"
        >
          {t(slide.titleKey)}
        </Animated.Text>

        <Animated.View
          style={[
            accentAnim,
            {
              height: 3,
              borderRadius: 2,
              backgroundColor: slide.accentColor,
              marginBottom: 16,
              shadowColor: slide.accentColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.9,
              shadowRadius: 8,
              elevation: 5,
            },
          ]}
        />

        <Animated.Text
          style={[
            subAnim,
            {
              maxWidth: "86%",
              textShadowColor: "rgba(0,0,0,0.5)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 5,
            },
          ]}
          className="text-[15.5px] font-normal leading-6 tracking-[0.1px] text-white/80"
        >
          {t(slide.subtitleKey)}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}
