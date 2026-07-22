import React from "react";

import { ChevronRight } from "lucide-react-native";
import { ScrollView } from "react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import EntityGridCard from "@/components/custom/discover/EntityGridCard";
import SectionTitle from "@/components/custom/discover/SectionTitle";

import { SPACING_PX } from "@/constants";
import { resolveTaxonomyIcon } from "@/constants/mdi-icon-map";
import { CAT_BY_TITLE, POPULAR, TAX } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND } from "@/constants/web-reference-theme";

const FEATURED_TITLE = "Temples & Deities";

interface CategoryLensProps {
  onCat: (category: TaxonomyCategory) => void;
  onEntity: (name: string, cat: TaxonomyCategory, sub: string) => void;
}

function CategoryLens({ onCat, onEntity }: CategoryLensProps) {
  const featured = CAT_BY_TITLE[FEATURED_TITLE];

  return (
    <VStack className="pt-2">
      {featured ? (
        <>
          <Pressable
            onPress={() => onCat(featured)}
            accessibilityRole="button"
            accessibilityLabel={featured.displayTitle}
            style={{ backgroundColor: featured.colour }}
            className="mx-4 mb-2 overflow-hidden rounded-[20px] p-4"
          >
            <Text
              style={{ color: featured.onColour }}
              className={`${WEB_FONT_BODY[700]} text-xs tracking-[1px] opacity-[0.85]`}
            >
              DEVBHOOMI · LAND OF GODS
            </Text>
            <Text
              style={{ color: featured.onColour }}
              className={`${WEB_FONT_ROUND[800]} mt-1 text-2xl`}
            >
              Temples & Deities
            </Text>
            <Text
              style={{ color: featured.onColour }}
              className={`${WEB_FONT_BODY[400]} mt-1 max-w-[80%] text-sm opacity-90`}
            >
              {featured.summary}
            </Text>
            <HStackRow>
              <Text style={{ color: featured.onColour }} className={`${WEB_FONT_ROUND[700]} text-sm`}>
                Explore
              </Text>
              <Icon as={ChevronRight} size="sm" style={{ color: featured.onColour }} />
            </HStackRow>
          </Pressable>

          <SectionTitle>Popular places</SectionTitle>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING_PX[4], gap: SPACING_PX[3], paddingBottom: SPACING_PX[1] }}
            style={{ marginBottom: SPACING_PX[1] }}
          >
            {POPULAR.map((p) => (
              <EntityGridCard
                key={p.name}
                icon={resolveTaxonomyIcon(p.catObj.icon, ChevronRight)}
                iconColor={p.catObj.onColour}
                iconBgColor={p.catObj.colour}
                name={p.name}
                nameColor={p.catObj.text}
                nameNumberOfLines={2}
                subtitle={p.catObj.displayTitle}
                subtitleColor={p.catObj.text}
                subtitleNumberOfLines={1}
                onPress={() => onEntity(p.name, p.catObj, p.sub)}
                style={{ width: 140, backgroundColor: p.catObj.background, minHeight: 110 }}
              />
            ))}
          </ScrollView>
        </>
      ) : null}

      <VStack className="px-4 pt-2">
        {TAX.themes.map((th) => (
          <VStack key={th} className="mb-4">
            <Text className={`${WEB_FONT_ROUND[700]} text-muted-foreground mb-3 px-1 text-sm`}>{th}</Text>
            <Box className="flex-row flex-wrap gap-3">
              {TAX.categories
                .filter((x) => x.theme === th)
                .map((cat) => (
                  <Pressable
                    key={cat.title}
                    onPress={() => onCat(cat)}
                    accessibilityRole="button"
                    accessibilityLabel={cat.displayTitle}
                    style={{ flexBasis: "47.5%", flexGrow: 1, backgroundColor: cat.background, minHeight: 104 }}
                    className="justify-between rounded-2xl p-4"
                  >
                    <Box
                      style={{ backgroundColor: cat.colour }}
                      className="h-10 w-10 items-center justify-center rounded-full"
                    >
                      <Icon
                        as={resolveTaxonomyIcon(cat.icon, ChevronRight)}
                        size="md"
                        style={{ color: cat.onColour }}
                      />
                    </Box>
                    <VStack>
                      <Text
                        numberOfLines={1}
                        style={{ color: cat.text }}
                        className={`${WEB_FONT_ROUND[700]} text-base`}
                      >
                        {cat.displayTitle}
                      </Text>
                      <Text
                        style={{ color: cat.text }}
                        className={`${WEB_FONT_BODY[400]} mt-px text-xs opacity-75`}
                      >
                        {cat.subCount} topics · {cat.entCount} places
                      </Text>
                    </VStack>
                  </Pressable>
                ))}
            </Box>
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
}

function HStackRow({ children }: { children: React.ReactNode }) {
  return <Box className="mt-3 flex-row items-center gap-1">{children}</Box>;
}

export default React.memo(CategoryLens);
