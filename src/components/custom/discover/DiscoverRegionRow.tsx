import React from "react";

import { ChevronRight, MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { router } from "expo-router";

import { ROUTES } from "@/routes";
import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface DiscoverRegionRowProps {
  region: DiscoverRegion;
}

function DiscoverRegionRow({ region }: DiscoverRegionRowProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => router.push(ROUTES.DISCOVER.REGION_DETAILS(region.id))}
      accessibilityRole="button"
      accessibilityLabel={t("discover.place_a11y", { place: region.name })}
      className="active:opacity-80"
    >
      <HStack
        space="md"
        className="items-center rounded-2xl border border-border bg-card px-4 py-3"
      >
        <Box
          className={`h-10 w-10 items-center justify-center rounded-full ${POST_METADATA_TINTS.rose.iconBg}`}
        >
          <Icon
            as={MapPin}
            size="md"
            className={POST_METADATA_TINTS.rose.iconColor}
          />
        </Box>
        <VStack className="flex-1">
          <Heading size="sm" className="text-foreground">
            {region.name}
          </Heading>
          <Text className="text-xs text-muted-foreground">
            {t("discover.posts_count", { count: region.postsCount })}
            {" · "}
            {t("discover.districts_count", { count: region.districtsCount })}
          </Text>
        </VStack>
        <Icon as={ChevronRight} size="sm" className="text-muted-foreground" />
      </HStack>
    </Pressable>
  );
}

export default React.memo(DiscoverRegionRow);
