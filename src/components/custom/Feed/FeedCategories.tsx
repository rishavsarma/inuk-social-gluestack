import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

interface FeedCategory {
  id: string;
  labelKey: string;
  ringClassName: string;
  imageUrl: string;
}

const CATEGORIES: FeedCategory[] = [
  {
    id: "nature",
    labelKey: "feed.categories.nature",
    ringClassName: "border-emerald-500",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    id: "photography",
    labelKey: "feed.categories.photography",
    ringClassName: "border-blue-500",
    imageUrl: "https://picsum.photos/seed/inuk-photography/200/200",
  },
  {
    id: "design",
    labelKey: "feed.categories.design",
    ringClassName: "border-violet-500",
    imageUrl: "https://picsum.photos/seed/inuk-design/200/200",
  },
  {
    id: "travel",
    labelKey: "feed.categories.travel",
    ringClassName: "border-orange-500",
    imageUrl: "https://picsum.photos/seed/inuk-travel/200/200",
  },
  {
    id: "food",
    labelKey: "feed.categories.food",
    ringClassName: "border-red-500",
    imageUrl: "https://picsum.photos/seed/inuk-food/200/200",
  },
  {
    id: "fashion",
    labelKey: "feed.categories.fashion",
    ringClassName: "border-pink-500",
    imageUrl: "https://picsum.photos/seed/inuk-fashion/200/200",
  },
];

export function FeedCategories() {
  const { t } = useTranslation();

  return (
    <Box className="bg-card border-b border-border/20  py-3  mb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName=" gap-4 px-4"
      >
        {CATEGORIES.map((category) => {
          return (
            <Button
              variant="default"
              key={category.id}
              accessibilityRole="button"
              accessibilityLabel={t(category.labelKey)}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
