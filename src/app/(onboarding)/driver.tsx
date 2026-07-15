import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Platform, View, ViewToken } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";

import { OnboardingNextButton } from "@/components/custom/onboarding/OnboardingNextButton";
import { OnboardingPagination } from "@/components/custom/onboarding/OnboardingPagination";
import { OnboardingSlideItem } from "@/components/custom/onboarding/OnboardingSlideItem";
import { useAppInsets } from "@/hooks/useAppInsets";
import {
  ONBOARDING_SLIDES,
  type OnboardingSlide,
} from "@/constants/onboarding";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { useSettingStore } from "@/stores/setting.store";

const VIEWABILITY_CONFIG = {
  minimumViewTime: 300,
  viewAreaCoveragePercentThreshold: 10,
};

const OnboardingDriver = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useAppInsets();
  const flatListRef = useAnimatedRef<FlatList<OnboardingSlide>>();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);

  const setHasCompletedOnboarding = useSettingStore(
    (s) => s.setHasCompletedOnboarding,
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        flatListIndex.value = viewableItems[0].index!;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
    [],
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const handleFinish = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHasCompletedOnboarding(true);
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    router.replace(isAuthenticated ? ROUTES.TABS.FEED : ROUTES.AUTH.HOME);
  }, [router, setHasCompletedOnboarding]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <HStack
        className="absolute left-0 right-0 z-10 justify-end px-4"
        style={{ top: insets.top + 28 }}
      >
        <Pressable
          onPress={handleFinish}
          accessibilityRole="button"
          accessibilityLabel={t("onboarding.skip")}
          className="overflow-hidden rounded-full active:opacity-70"
        >
          <BlurView
            intensity={Platform.OS === "android" ? 100 : 50}
            tint="dark"
            className="items-center justify-center px-4 py-2"
          >
            <Text className="text-xs font-semibold tracking-wide text-white">
              {t("onboarding.skip")}
            </Text>
          </BlurView>
        </Pressable>
      </HStack>

      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={ONBOARDING_SLIDES}
        renderItem={({ item, index }) => (
          <OnboardingSlideItem slide={item} index={index} x={x} />
        )}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        horizontal
        bounces={false}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
      />

      <View className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-t-4xl">
        <HStack
          className="items-center justify-between px-6 pt-5"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <OnboardingPagination data={ONBOARDING_SLIDES} x={x} />
          <OnboardingNextButton
            flatListRef={flatListRef}
            flatListIndex={flatListIndex}
            dataLength={ONBOARDING_SLIDES.length}
            onFinish={handleFinish}
          />
        </HStack>
      </View>
    </View>
  );
};

export default OnboardingDriver;
