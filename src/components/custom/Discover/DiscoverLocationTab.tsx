import React, { useCallback } from "react";

import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import { MOCK_DISCOVER_PLACES, MOCK_DISCOVER_REGIONS } from "@/constants/mock-data";
import { ROUTES } from "@/routes";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
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
        <Text className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
          {t("discover.map_caption")}
        </Text>
      </Box>

      <VStack space="sm">
        <Heading size="sm" className="px-4 text-foreground">
          {t("discover.regions_title")}
        </Heading>
        <VStack space="sm" className="px-4">
          {MOCK_DISCOVER_REGIONS.map((region) => (
            <DiscoverRegionRow key={region.id} region={region} />
          ))}
        </VStack>
      </VStack>

      <VStack space="sm">
        <Heading size="sm" className="px-4 text-foreground">
          {t("discover.popular_places_title")}
        </Heading>
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
