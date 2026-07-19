import React from "react";

import { useColorScheme } from "react-native";

import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { TRENDING_TAGS, type WebTrendingTag } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND, WEB_PALETTE, WEB_TEXT_SUB } from "@/constants/web-reference-theme";

interface TagLensProps {
  onTag: (tag: WebTrendingTag) => void;
}

function TagLens({ onTag }: TagLensProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mb-2.5 mt-4.5 px-4.5 text-[14px]`}>
        Trending tags
      </Text>
      <VStack className="px-3.5">
        {TRENDING_TAGS.map((t) => (
          <Pressable
            key={t.tag}
            onPress={() => onTag(t)}
            accessibilityRole="button"
            accessibilityLabel={`#${t.tag}`}
            style={{ borderColor: isDark ? "#2b3050" : "#E3E4EC" }}
            className="flex-row items-center justify-between border-b py-3.5"
          >
            <Text style={{ color: WEB_PALETTE.red }} className={`${WEB_FONT_ROUND[700]} text-[16px]`}>
              #{t.tag}
            </Text>
            <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-[12.5px]`}>
              {t.posts.toLocaleString()} posts
            </Text>
          </Pressable>
        ))}
      </VStack>
    </ScrollView>
  );
}

export default React.memo(TagLens);
