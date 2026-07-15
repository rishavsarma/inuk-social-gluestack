import { useMemo } from "react";

import { useLocalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import {
  getBlockById,
  getDistrictById,
  getLocalityById,
  getPoiById,
  getRegionById,
  getSettlementById,
} from "@/constants/mock-geo-data";
import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";
import { ROUTES } from "@/routes";

import { AnimatedStatNumber } from "@/components/custom/NumberFormatter";
import GeoBreadcrumb from "@/components/custom/geo/GeoBreadcrumb";
import GeoCoverHero from "@/components/custom/geo/GeoCoverHero";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

const TOP_TILE_TINTS: (keyof typeof POST_METADATA_TINTS)[] = [
  "green",
  "amber",
  "sky",
];

const PoiScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { poiId } = useLocalSearchParams<{ poiId: string }>();

  const poi = useMemo(() => getPoiById(poiId), [poiId]);
  const locality = useMemo(
    () => (poi ? getLocalityById(poi.localityId) : undefined),
    [poi],
  );
  const settlement = useMemo(
    () => (poi ? getSettlementById(poi.settlementId) : undefined),
    [poi],
  );
  const block = useMemo(
    () => (settlement ? getBlockById(settlement.blockId) : undefined),
    [settlement],
  );
  const district = useMemo(
    () => (block ? getDistrictById(block.districtId) : undefined),
    [block],
  );
  const region = useMemo(
    () => (district ? getRegionById(district.regionId) : undefined),
    [district],
  );

  const handleDocumentPress = () => {
    if (!poi) return;
    toast.show({
      placement: "bottom",
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
          <ToastDescription>{t("discover.coming_soon")}</ToastDescription>
        </Toast>
      ),
    });
  };

  if (!poi || !locality || !settlement || !block || !district || !region) {
    return (
      <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">{t("geo.poi_not_found")}</Text>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  const categoryLabel = t(`geo.poi_category_${poi.category.toLowerCase()}`);

  return (
    <KeyboardAvoidingScrollView showBackButton alwaysShowBar title={poi.name}>
      <VStack space="lg" className="pb-10">
        <GeoCoverHero
          title={poi.name}
          subtitle={`${locality.name} · ${settlement.name} · ${district.name}`}
          badgeLabel={`${t("geo.level_poi")} · ${categoryLabel}`}
          touristWorthy={poi.touristWorthy}
          tint={poi.tint}
        />

        <GeoBreadcrumb
          items={[
            {
              label: region.name,
              href: ROUTES.DISCOVER.REGION_DETAILS(region.id),
            },
            {
              label: district.name,
              href: ROUTES.DISCOVER.DISTRICT_DETAILS(district.id),
            },
            {
              label: block.name,
              href: ROUTES.DISCOVER.BLOCK_DETAILS(block.id),
            },
            {
              label: settlement.name,
              href: ROUTES.DISCOVER.SETTLEMENT_DETAILS(settlement.id),
            },
            {
              label: locality.name,
              href: ROUTES.DISCOVER.LOCALITY_DETAILS(locality.id),
            },
            { label: poi.name },
          ]}
        />

        <HStack className="items-center justify-around px-4">
          <VStack className="items-center">
            <AnimatedStatNumber value={poi.postsCount} />
            <Text className="text-xs text-muted-foreground">
              {t("place.posts_stat")}
            </Text>
          </VStack>
          <VStack className="items-center">
            <AnimatedStatNumber value={poi.contributorsCount} />
            <Text className="text-xs text-muted-foreground">
              {t("place.contributors_stat")}
            </Text>
          </VStack>
          <VStack className="items-center">
            <Text className="text-[17px] font-bold text-foreground">
              {poi.touristWorthy ? "★" : "—"}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {t("geo.tourist_worthy_stat")}
            </Text>
          </VStack>
        </HStack>

        <VStack space="sm" className="px-4">
          <Heading size="sm" className="text-foreground">
            {t("place.top_from", { place: poi.name })}
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
            accessibilityLabel={t("geo.post_from_cta_a11y", { poi: poi.name })}
            className="rounded-full"
          >
            <ButtonIcon as={Plus} className="text-white" />
            <ButtonText className="text-white">
              {t("geo.post_from_cta", { poi: poi.name })}
            </ButtonText>
          </Button>
        </Box>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default PoiScreen;
