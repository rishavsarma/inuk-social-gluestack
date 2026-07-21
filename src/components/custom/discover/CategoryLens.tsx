import React from "react";

import { ChevronRight } from "lucide-react-native";
import { ScrollView } from "react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

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
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}>
      {featured ? (
        <>
          <Pressable
            onPress={() => onCat(featured)}
            accessibilityRole="button"
            accessibilityLabel={featured.displayTitle}
            style={{ backgroundColor: featured.colour }}
            className="mx-3.5 mb-1.5 overflow-hidden rounded-[20px] p-4.5"
          >
            <Text
              style={{ color: featured.onColour }}
              className={`${WEB_FONT_BODY[700]} text-[11px] tracking-[1px] opacity-[0.85]`}
            >
              DEVBHOOMI · LAND OF GODS
            </Text>
            <Text
              style={{ color: featured.onColour }}
              className={`${WEB_FONT_ROUND[800]} mt-1 text-[22px]`}
            >
              Temples & Deities
            </Text>
            <Text
              style={{ color: featured.onColour }}
              className={`${WEB_FONT_BODY[400]} mt-0.75 max-w-[80%] text-[13px] opacity-90`}
            >
              {featured.summary}
            </Text>
            <HStackRow>
              <Text style={{ color: featured.onColour }} className={`${WEB_FONT_ROUND[700]} text-[13px]`}>
                Explore
              </Text>
              <Icon as={ChevronRight} size="sm" style={{ color: featured.onColour }} />
            </HStackRow>
          </Pressable>

          <SectionTitle>Popular places</SectionTitle>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 14, gap: 10, paddingBottom: 4 }}
            style={{ marginBottom: 4 }}
          >
            {POPULAR.map((p) => (
              <Pressable
                key={p.name}
                onPress={() => onEntity(p.name, p.catObj, p.sub)}
                accessibilityRole="button"
                accessibilityLabel={p.name}
                style={{ width: 140, backgroundColor: p.catObj.background, minHeight: 110 }}
                className="justify-between rounded-2xl p-3"
              >
                <Box
                  style={{ backgroundColor: p.catObj.colour }}
                  className="h-8.5 w-8.5 items-center justify-center rounded-[17px]"
                >
                  <Icon
                    as={resolveTaxonomyIcon(p.catObj.icon, ChevronRight)}
                    size="sm"
                    style={{ color: p.catObj.onColour }}
                  />
                </Box>
                <VStack>
                  <Text
                    numberOfLines={2}
                    style={{ color: p.catObj.text }}
                    className={`${WEB_FONT_ROUND[700]} text-[14px]`}
                  >
                    {p.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ color: p.catObj.text }}
                    className={`${WEB_FONT_BODY[400]} mt-px text-[11px] opacity-70`}
                  >
                    {p.catObj.displayTitle}
                  </Text>
                </VStack>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}

      <VStack className="px-3.5 pt-2">
        {TAX.themes.map((th) => (
          <VStack key={th} className="mb-4">
            <Text className={`${WEB_FONT_ROUND[700]} text-muted-foreground mb-2.5 px-1 text-[14px]`}>{th}</Text>
            <Box className="flex-row flex-wrap gap-2.5">
              {TAX.categories
                .filter((x) => x.theme === th)
                .map((cat) => (
                  <Pressable
                    key={cat.title}
                    onPress={() => onCat(cat)}
                    accessibilityRole="button"
                    accessibilityLabel={cat.displayTitle}
                    style={{ flexBasis: "47.5%", flexGrow: 1, backgroundColor: cat.background, minHeight: 104 }}
                    className="justify-between rounded-2xl p-3.5"
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
                        className={`${WEB_FONT_ROUND[700]} text-[15.5px]`}
                      >
                        {cat.displayTitle}
                      </Text>
                      <Text
                        style={{ color: cat.text }}
                        className={`${WEB_FONT_BODY[400]} mt-px text-[11.5px] opacity-75`}
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
    </ScrollView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className={`${WEB_FONT_ROUND[700]} text-muted-foreground mb-2.5 mt-4.5 px-4.5 text-[14px]`}>
      {children}
    </Text>
  );
}

function HStackRow({ children }: { children: React.ReactNode }) {
  return <Box className="mt-3 flex-row items-center gap-1">{children}</Box>;
}

export default React.memo(CategoryLens);
