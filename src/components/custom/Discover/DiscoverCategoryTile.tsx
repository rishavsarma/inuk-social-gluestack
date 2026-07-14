import React from "react";

import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react-native";

import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface DiscoverCategoryTileProps {
  category: DiscoverCategory;
  icon: LucideIcon;
  isActive: boolean;
  onPress: (category: DiscoverCategory) => void;
}

function DiscoverCategoryTile({
  category,
  icon,
  isActive,
  onPress,
}: DiscoverCategoryTileProps) {
  const { t } = useTranslation();
  const tint = POST_METADATA_TINTS[category.tint];
  const label = t(category.labelKey);

  return (
    <Pressable
      onPress={() => onPress(category)}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
      className="w-20 items-center gap-1.5 active:opacity-70"
    >
      <Box
        className={`h-16 w-16 items-center justify-center rounded-full ${tint.iconBg} ${
          isActive ? "ring-2 ring-theme" : ""
        }`}
      >
        <Icon as={icon} size="lg" className={tint.iconColor} />
      </Box>
      <Text
        className="text-center text-xs font-medium text-foreground"
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default React.memo(DiscoverCategoryTile);
