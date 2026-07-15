import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Href, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import { FEED_CATEGORIES } from "@/constants/mock-data";
import { ROUTES } from "@/routes";

export function FeedCategories() {
  const { t } = useTranslation();

  return (
    <Box className="bg-card border-b border-border/20  py-3  mb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName=" gap-4 px-4"
      >
        {FEED_CATEGORIES.map((category) => {
          return (
            <Button
              variant="default"
              key={category.id}
              accessibilityRole="button"
              accessibilityLabel={t(category.labelKey)}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(
                  ROUTES.CONTENT.CATEGORY_DETAILS(category.id) as Href,
                );
              }}
              className="px-0  py-0 data-[active=true]:bg-transparent bg-transparent"
            >
              <VStack space="xs" className="items-center">
                <Box
                  className={`h-20 w-20 rounded-full border-[2.5px] p-0.75 ${category.ringClassName}`}
                >
                  <Box className="h-full w-full overflow-hidden rounded-full ">
                    <Image
                      source={{ uri: category.imageUrl }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={200}
                      alt={t("feed.category_thumbnail_alt", {
                        category: t(category.labelKey),
                      })}
                    />
                  </Box>
                </Box>
                <Text size="xs" className=" font-medium">
                  {t(category.labelKey)}
                </Text>
              </VStack>
            </Button>
          );
        })}
      </ScrollView>
    </Box>
  );
}
