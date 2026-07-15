import React, { useCallback } from "react";

import { CompassIcon, MapPinIcon, StarIcon } from "lucide-react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { MOCK_DISCOVER_PLACES, MOCK_DISCOVER_REGIONS } from "@/constants/mock-data";
import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";
import { ROUTES } from "@/routes";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import DiscoverPlaceCard from "./DiscoverPlaceCard";
import DiscoverRegionRow from "./DiscoverRegionRow";

function DiscoverLocationTab() {
  const { t } = useTranslation();

  const handlePlacePress = useCallback((place: DiscoverPlace) => {
    router.push(ROUTES.DISCOVER.PLACE_DETAILS(place.id));
  }, []);

  return (
    <VStack space="lg">
      <Box className="mx-4 h-40 items-end justify-end overflow-hidden rounded-2xl bg-muted p-3">
        {/* Grid lines — same decorative "map" motif as the post-detail map tile */}
        <View className="absolute inset-0 opacity-20">
          <View className="absolute left-1/4 h-full w-px bg-black/30 dark:bg-white/30" />
          <View className="absolute left-2/4 h-full w-px bg-black/30 dark:bg-white/30" />
          <View className="absolute left-3/4 h-full w-px bg-black/30 dark:bg-white/30" />
          <View className="absolute top-1/3 h-px w-full bg-black/30 dark:bg-white/30" />
          <View className="absolute top-2/3 h-px w-full bg-black/30 dark:bg-white/30" />
        </View>
        <View className="absolute inset-0 items-center justify-center">
          <Box
            className={`h-14 w-14 items-center justify-center rounded-full ${POST_METADATA_TINTS.rose.iconBg}`}
          >
            <Icon
              as={CompassIcon}
              size="xl"
              className={POST_METADATA_TINTS.rose.iconColor}
            />
          </Box>
        </View>
        <Text className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
          {t("discover.map_caption")}
        </Text>
      </Box>

      <VStack space="sm">
        <HStack space="xs" className="items-center px-4">
          <Icon as={MapPinIcon} size="sm" className="text-theme" />
          <Heading size="sm" className="font-baloo-bold text-foreground">
            {t("discover.regions_title")}
          </Heading>
        </HStack>
        <VStack space="sm" className="px-4">
          {MOCK_DISCOVER_REGIONS.map((region) => (
            <DiscoverRegionRow key={region.id} region={region} />
          ))}
        </VStack>
      </VStack>

      <VStack space="sm">
        <HStack space="xs" className="items-center px-4">
          <Icon as={StarIcon} size="sm" className="text-theme" />
          <Heading size="sm" className="font-baloo-bold text-foreground">
            {t("discover.popular_places_title")}
          </Heading>
        </HStack>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
        >
          {MOCK_DISCOVER_PLACES.map((place) => (
            <DiscoverPlaceCard
              key={place.id}
              place={place}
              onPress={handlePlacePress}
            />
          ))}
        </ScrollView>
      </VStack>
    </VStack>
  );
}

export default React.memo(DiscoverLocationTab);
