import React from "react";

import { Star } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface GeoPoiTileProps {
  poi: GeoPoi;
  onPress: (poi: GeoPoi) => void;
}

function GeoPoiTile({ poi, onPress }: GeoPoiTileProps) {
  const { t } = useTranslation();
  const tint = POST_METADATA_TINTS[poi.tint];

  return (
    <Pressable
      onPress={() => onPress(poi)}
      accessibilityRole="button"
      accessibilityLabel={t("geo.open_poi_a11y", { name: poi.name })}
      className="w-28 active:opacity-80"
    >
      <VStack space="xs">
        <Box
          className={`h-24 w-28 items-end justify-start rounded-xl p-2 ${tint.iconBg}`}
        >
          {poi.touristWorthy && (
            <Icon as={Star} size="xs" className="text-amber-500 fill-amber-500" />
          )}
        </Box>
        <Text
          className="text-sm font-semibold text-foreground"
          numberOfLines={1}
        >
          {poi.name}
        </Text>
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          {t(`geo.poi_category_${poi.category.toLowerCase()}`)}
        </Text>
      </VStack>
    </Pressable>
  );
}

export default React.memo(GeoPoiTile);
