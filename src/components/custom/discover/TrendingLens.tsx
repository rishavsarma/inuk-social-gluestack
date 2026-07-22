import React from "react";

import { ChevronRight } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import EntityGridCard from "@/components/custom/discover/EntityGridCard";
import SectionTitle from "@/components/custom/discover/SectionTitle";

import { resolveTaxonomyIcon } from "@/constants/mdi-icon-map";
import { POPULAR } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND } from "@/constants/web-reference-theme";

interface TrendingLensProps {
  onEntity: (name: string, cat: TaxonomyCategory, sub: string) => void;
}

function TrendingLens({ onEntity }: TrendingLensProps) {
  return (
    <VStack className="pt-2">
      <SectionTitle>Trending this week</SectionTitle>
      <Box className="flex-row flex-wrap gap-3 px-4">
        {POPULAR.map((p) => (
          <EntityGridCard
            key={p.name}
            icon={resolveTaxonomyIcon(p.catObj.icon, ChevronRight)}
            iconColor={p.catObj.onColour}
            iconBgColor={p.catObj.colour}
            name={p.name}
            nameColor={p.catObj.text}
            nameClassName={`${WEB_FONT_ROUND[700]} text-sm`}
            subtitle={p.catObj.displayTitle}
            subtitleColor={p.catObj.text}
            subtitleClassName={`${WEB_FONT_BODY[400]} text-xs opacity-70`}
            onPress={() => onEntity(p.name, p.catObj, p.sub)}
            style={{ flexBasis: "47.5%", flexGrow: 1, backgroundColor: p.catObj.background, minHeight: 96 }}
          />
        ))}
      </Box>
      <Text className={`${WEB_FONT_BODY[400]} text-muted-foreground mt-5 px-8 text-center text-xs`}>
        Real-time trending arrives with post activity.
      </Text>
    </VStack>
  );
}

export default React.memo(TrendingLens);
