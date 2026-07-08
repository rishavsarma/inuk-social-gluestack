import { Text } from "@/components/ui/text";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

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
    imageUrl: "https://picsum.photos/seed/inuk-nature/200/200",
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-4 px-4"
    >
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityLabel={t(category.labelKey)}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveCategory((prev) =>
                prev === category.id ? null : category.id,
              );
            }}
            className="w-16 items-center active:opacity-70"
          >
            <View
              className={`h-[68px] w-[68px] rounded-full border-[2.5px] p-[3px] ${category.ringClassName} ${
                isActive ? "opacity-100" : "opacity-90"
              }`}
            >
              <View className="flex-1 overflow-hidden rounded-full bg-muted">
                <Image
                  source={{ uri: category.imageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={200}
                />
              </View>
            </View>
            <Text
              numberOfLines={1}
              className="mt-1.5 text-xs font-medium text-foreground"
            >
              {t(category.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
