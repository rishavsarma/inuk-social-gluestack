import React from "react";

import { ChevronRight } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { resolveTaxonomyIcon } from "@/constants/mdi-icon-map";
import { POPULAR } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND } from "@/constants/web-reference-theme";

interface TrendingLensProps {
  onEntity: (name: string, cat: TaxonomyCategory, sub: string) => void;
}

function TrendingLens({ onEntity }: TrendingLensProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}>
      <Text className={`${WEB_FONT_ROUND[700]} text-muted-foreground mb-2.5 mt-4.5 px-4.5 text-[14px]`}>
        Trending this week
      </Text>
      <Box className="flex-row flex-wrap gap-2.5 px-3.5">
        {POPULAR.map((p) => (
          <Pressable
            key={p.name}
            onPress={() => onEntity(p.name, p.catObj, p.sub)}
            accessibilityRole="button"
            accessibilityLabel={p.name}
            style={{ flexBasis: "47.5%", flexGrow: 1, backgroundColor: p.catObj.background, minHeight: 96 }}
            className="justify-between rounded-2xl p-3"
          >
            <Box
              style={{ backgroundColor: p.catObj.colour }}
              className="h-8.5 w-8.5 items-center justify-center rounded-[17px]"
            >
              <Icon as={resolveTaxonomyIcon(p.catObj.icon, ChevronRight)} size="sm" style={{ color: p.catObj.onColour }} />
            </Box>
            <VStack>
              <Text style={{ color: p.catObj.text }} className={`${WEB_FONT_ROUND[700]} text-[14.5px]`}>
                {p.name}
              </Text>
              <Text style={{ color: p.catObj.text }} className={`${WEB_FONT_BODY[400]} text-[11px] opacity-70`}>
                {p.catObj.displayTitle}
              </Text>
            </VStack>
          </Pressable>
        ))}
      </Box>
      <Text className={`${WEB_FONT_BODY[400]} text-muted-foreground mt-5 px-7.5 text-center text-[12.5px]`}>
        Real-time trending arrives with post activity.
      </Text>
    </ScrollView>
  );
}

export default React.memo(TrendingLens);
