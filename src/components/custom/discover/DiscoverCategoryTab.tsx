import React, { useMemo, useState } from "react";

import {
  Building2,
  Hammer,
  ImageIcon,
  Landmark,
  Mountain,
  PawPrint,
  Tag,
  Trees,
  Users,
  UtensilsCrossed,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";
import { MOCK_DISCOVER_CATEGORIES } from "@/constants/mock-data";

import { ImagePlaceholder } from "@/components/custom/ImagePlaceholder";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import DiscoverCategoryTile from "./DiscoverCategoryTile";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Trees,
  Landmark,
  UtensilsCrossed,
  Building2,
  Users,
  Mountain,
  PawPrint,
  Hammer,
};

const TOP_TILE_TINTS: (keyof typeof POST_METADATA_TINTS)[] = [
  "green",
  "amber",
  "sky",
];

function DiscoverCategoryTab() {
  const { t } = useTranslation();
  const [activeCategoryId, setActiveCategoryId] = useState(
    MOCK_DISCOVER_CATEGORIES[0].id,
  );

  const activeCategory = useMemo(
    () =>
      MOCK_DISCOVER_CATEGORIES.find((c) => c.id === activeCategoryId) ??
      MOCK_DISCOVER_CATEGORIES[0],
    [activeCategoryId],
  );

  return (
    <VStack space="lg">
      <HStack space="md" className="flex-row flex-wrap gap-y-4 px-4">
        {MOCK_DISCOVER_CATEGORIES.map((category) => (
          <DiscoverCategoryTile
            key={category.id}
            category={category}
            icon={CATEGORY_ICONS[category.icon]}
            isActive={category.id === activeCategoryId}
            onPress={(selected) => setActiveCategoryId(selected.id)}
          />
        ))}
      </HStack>

      <VStack space="sm">
        <HStack space="xs" className="items-center px-4">
          <Icon as={Tag} size="sm" className="text-theme" />
          <Heading size="sm" className="font-baloo-bold text-foreground">
            {t("discover.category_subcategories_title", {
              category: t(activeCategory.labelKey),
            })}
          </Heading>
        </HStack>
        <HStack space="sm" className="flex-row flex-wrap gap-y-2 px-4">
          {activeCategory.subcategories.map((subcategory) => (
            <Badge
              key={subcategory}
              variant="outline"
              className="rounded-full border-theme/20 bg-theme/10 px-3 py-1.5"
            >
              <BadgeText className="normal-case font-semibold text-theme">
                {subcategory}
              </BadgeText>
            </Badge>
          ))}
        </HStack>
      </VStack>

      <VStack space="sm">
        <HStack space="xs" className="items-center px-4">
          <Icon as={ImageIcon} size="sm" className="text-theme" />
          <Heading size="sm" className="font-baloo-bold text-foreground">
            {t("discover.top_in_category", {
              category: t(activeCategory.labelKey),
            })}
          </Heading>
        </HStack>
        <HStack space="sm" className="px-4">
          {TOP_TILE_TINTS.map((tintKey) => (
            <ImagePlaceholder
              key={tintKey}
              icon={ImageIcon}
              tint={tintKey}
              className="aspect-square flex-1 rounded-xl"
            />
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
}

export default React.memo(DiscoverCategoryTab);
