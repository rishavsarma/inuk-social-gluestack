import { useMemo } from "react";

import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { AnimatedStatNumber } from "@/components/custom/NumberFormatter";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { MOCK_DISCOVER_PLACES } from "@/constants/mock-data";
import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

const TOP_TILE_TINTS: (keyof typeof POST_METADATA_TINTS)[] = [
  "green",
  "amber",
  "sky",
];

const PlaceScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { placeId } = useLocalSearchParams<{ placeId: string }>();

  const place = useMemo(
    () => MOCK_DISCOVER_PLACES.find((item) => item.id === placeId),
    [placeId],
  );

  const handleDocumentPress = () => {
    if (!place) return;
    toast.show({
      placement: "bottom",
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
          <ToastDescription>{t("discover.coming_soon")}</ToastDescription>
        </Toast>
      ),
    });
  };

  if (!place) {
    return (
      <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">{t("place.not_found")}</Text>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  const tint = POST_METADATA_TINTS[place.tint];

  return (
    <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
      <VStack space="lg" className="pb-10">
        <Box className={`h-56 w-full justify-end p-4 ${tint.iconBg}`}>
          <Heading size="2xl" className="text-foreground">
            {place.name}
          </Heading>
          <Text className="text-sm text-muted-foreground">
            {place.type} · {place.district} · {place.region}
          </Text>
        </Box>

        <VStack space="xs" className="px-4">
          <HStack className="items-center justify-between">
            <Text className="text-sm font-semibold text-muted-foreground">
              {t("place.coverage_label", { percent: place.coveragePercent })}
            </Text>
          </HStack>
          <Progress value={place.coveragePercent}>
            <ProgressFilledTrack />
          </Progress>
        </VStack>

        <HStack className="items-center justify-around px-4">
          <VStack className="items-center">
            <AnimatedStatNumber value={place.postsCount} />
            <Text className="text-xs text-muted-foreground">
              {t("place.posts_stat")}
            </Text>
          </VStack>
          <VStack className="items-center">
            <AnimatedStatNumber value={place.contributorsCount} />
            <Text className="text-xs text-muted-foreground">
              {t("place.contributors_stat")}
            </Text>
          </VStack>
          <VStack className="items-center">
            <AnimatedStatNumber value={place.themesCount} />
            <Text className="text-xs text-muted-foreground">
              {t("place.themes_stat")}
            </Text>
          </VStack>
        </HStack>

        <VStack space="sm" className="px-4">
          <Heading size="sm" className="text-foreground">
            {t("place.top_from", { place: place.name })}
          </Heading>
          <HStack space="sm">
            {TOP_TILE_TINTS.map((tintKey) => (
              <Box
                key={tintKey}
                className={`aspect-square flex-1 rounded-xl ${POST_METADATA_TINTS[tintKey].iconBg}`}
              />
            ))}
          </HStack>
        </VStack>

        <Box className="px-4">
          <Button
            variant="theme"
            onPress={handleDocumentPress}
            accessibilityRole="button"
            accessibilityLabel={t("place.document_cta_a11y", {
              place: place.name,
            })}
            className="rounded-full"
          >
            <ButtonText className="text-white">
              {t("place.document_cta", { place: place.name })}
            </ButtonText>
          </Button>
        </Box>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default PlaceScreen;
