import React, { useMemo, useState } from "react";

import { Hash, ImageIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { MOCK_DISCOVER_TAGS } from "@/constants/mock-data";
import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

import { ImagePlaceholder } from "@/components/custom/ImagePlaceholder";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const GRID_TINTS: (keyof typeof POST_METADATA_TINTS)[] = [
  "green",
  "amber",
  "sky",
  "violet",
  "rose",
  "emerald",
];

function DiscoverTagTab() {
  const { t } = useTranslation();
  const [activeTagId, setActiveTagId] = useState(MOCK_DISCOVER_TAGS[0].id);

  const activeTag = useMemo(
    () => MOCK_DISCOVER_TAGS.find((tag) => tag.id === activeTagId) ?? MOCK_DISCOVER_TAGS[0],
    [activeTagId],
  );

  return (
    <VStack space="lg">
      <VStack space="sm">
        <HStack space="xs" className="items-center px-4">
          <Icon as={Hash} size="sm" className="text-theme" />
          <Heading size="sm" className="font-baloo-bold text-foreground">
            {t("discover.trending_tags_title")}
          </Heading>
        </HStack>
        <VStack space="xs" className="px-4">
          {MOCK_DISCOVER_TAGS.map((tag) => (
            <Pressable
              key={tag.id}
              onPress={() => setActiveTagId(tag.id)}
              accessibilityRole="button"
              accessibilityLabel={`#${tag.tag}`}
              accessibilityState={{ selected: tag.id === activeTagId }}
              className={`flex-row items-center justify-between rounded-xl px-3 py-2.5 active:opacity-70 ${
                tag.id === activeTagId ? "bg-theme/10" : ""
              }`}
            >
              <Text className="font-semibold text-theme">#{tag.tag}</Text>
              <Text className="text-xs text-muted-foreground">
                {t("discover.posts_count_plural", { count: tag.postsCount })}
              </Text>
            </Pressable>
          ))}
        </VStack>
      </VStack>

      <VStack space="sm">
        <HStack space="xs" className="items-center px-4">
          <Icon as={Hash} size="sm" className="text-theme" />
          <Heading size="sm" className="font-baloo-bold text-foreground">
            {activeTag.tag}
          </Heading>
        </HStack>
        <HStack space="sm" className="flex-row flex-wrap gap-y-2 px-4">
          {GRID_TINTS.map((tintKey, index) => (
            <ImagePlaceholder
              key={`${activeTag.id}-${tintKey}-${index}`}
              icon={ImageIcon}
              tint={tintKey}
              className="aspect-square w-[31%] rounded-xl"
            />
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
}

export default React.memo(DiscoverTagTab);
