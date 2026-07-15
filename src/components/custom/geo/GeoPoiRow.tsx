import React from "react";

import { ChevronRight, Star } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { GEO_POI_CATEGORIES } from "@/constants/geo-poi-categories";
import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface GeoPoiRowProps {
  poi: GeoPoi;
  onPress: (poi: GeoPoi) => void;
}

function GeoPoiRow({ poi, onPress }: GeoPoiRowProps) {
  const { t } = useTranslation();
  const category = GEO_POI_CATEGORIES[poi.category];
  const tint = POST_METADATA_TINTS[poi.tint];

  return (
    <Pressable
      onPress={() => onPress(poi)}
      accessibilityRole="button"
      accessibilityLabel={t("geo.open_poi_a11y", { name: poi.name })}
      className="active:opacity-80"
    >
      <HStack
        space="md"
        className="items-center rounded-2xl border border-border bg-card px-4 py-3"
      >
        <Box
          className={`h-10 w-10 items-center justify-center rounded-xl ${tint.iconBg}`}
        >
          <Icon as={category.icon} size="md" className={tint.iconColor} />
        </Box>
        <VStack className="flex-1">
          <HStack space="xs" className="items-center">
            <Heading size="sm" className="text-foreground" numberOfLines={1}>
              {poi.name}
            </Heading>
            {poi.touristWorthy && (
              <Icon
                as={Star}
                size="xs"
                className="text-amber-500 fill-amber-500"
              />
            )}
          </HStack>
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {t(`geo.poi_category_${poi.category.toLowerCase()}`)} ·{" "}
            {t("discover.posts_count", { count: poi.postsCount })}
          </Text>
        </VStack>
        <Icon as={ChevronRight} size="sm" className="text-muted-foreground" />
      </HStack>
    </Pressable>
  );
}

export default React.memo(GeoPoiRow);
