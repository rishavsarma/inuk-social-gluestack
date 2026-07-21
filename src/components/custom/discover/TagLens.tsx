import React from "react";

import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { TRENDING_TAGS, type WebTrendingTag } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND } from "@/constants/web-reference-theme";

interface TagLensProps {
  onTag: (tag: WebTrendingTag) => void;
}

function TagLens({ onTag }: TagLensProps) {
  return (
    <VStack>
      <Text className={`${WEB_FONT_ROUND[700]} text-muted-foreground mb-2.5 mt-4.5 px-4.5 text-[14px]`}>
        Trending tags
      </Text>
      <VStack className="px-3.5">
        {TRENDING_TAGS.map((t) => (
          <Pressable
            key={t.tag}
            onPress={() => onTag(t)}
            accessibilityRole="button"
            accessibilityLabel={`#${t.tag}`}
            className="flex-row items-center justify-between border-b border-border py-3.5"
          >
            <Text className={`${WEB_FONT_ROUND[700]} text-theme text-[16px]`}>
              #{t.tag}
            </Text>
            <Text className={`${WEB_FONT_BODY[400]} text-muted-foreground text-[12.5px]`}>
              {t.posts.toLocaleString()} posts
            </Text>
          </Pressable>
        ))}
      </VStack>
    </VStack>
  );
}

export default React.memo(TagLens);
