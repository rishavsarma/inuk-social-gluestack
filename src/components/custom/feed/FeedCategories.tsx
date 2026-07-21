import { ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Href, router } from "expo-router";
import { ScrollView } from "react-native";

import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { resolveTaxonomyIcon } from "@/constants/mdi-icon-map";
import { TAX, taxonomyThemeId } from "@/constants/discover-web-data";
import { ROUTES } from "@/routes";

interface FeedCategoriesProps {
  /** "rounded": squircle app-icon style badge. "glossy": circular badge with a
   * diagonal highlight + shadow for depth. Defaults to "rounded". */
  variant?: "rounded" | "glossy";
}

export function FeedCategories({ variant = "rounded" }: FeedCategoriesProps) {
  return (
    <Box className="bg-card border-b border-border/20  py-3  mb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName=" gap-4 px-4"
      >
        {TAX.categories.map((category) => {
          return (
            <Button
              variant="default"
              key={category.title}
              accessibilityRole="button"
              accessibilityLabel={category.displayTitle}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(
                  ROUTES.CONTENT.THEME_DETAILS(
                    taxonomyThemeId(category),
                  ) as Href,
                );
              }}
              className="px-0  py-0 data-[active=true]:bg-transparent bg-transparent"
            >
              <VStack space="xs" className="items-center">
                {variant === "glossy" ? (
                  <Box
                    style={{ backgroundColor: category.colour }}
                    className="h-16 w-16 items-center justify-center rounded-full shadow-md overflow-hidden"
                  >
                    <LinearGradient
                      colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
                      locations={[0, 0.6]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                      pointerEvents="none"
                    />
                    <Icon
                      as={resolveTaxonomyIcon(category.icon, ChevronRight)}
                      size="lg"
                      style={{ color: category.onColour }}
                    />
                  </Box>
                ) : (
                  <Box
                    style={{ backgroundColor: category.colour }}
                    className="h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
                  >
                    <Icon
                      as={resolveTaxonomyIcon(category.icon, ChevronRight)}
                      size="lg"
                      style={{ color: category.onColour }}
                    />
                  </Box>
                )}
                <Text size="xs" className="font-medium" numberOfLines={1}>
                  {category.displayTitle}
                </Text>
              </VStack>
            </Button>
          );
        })}
      </ScrollView>
    </Box>
  );
}
