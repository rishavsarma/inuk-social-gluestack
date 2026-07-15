import React from "react";

import { ImageIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { ImagePlaceholder } from "@/components/custom/ImagePlaceholder";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface DiscoverPlaceCardProps {
  place: DiscoverPlace;
  onPress: (place: DiscoverPlace) => void;
}

function DiscoverPlaceCard({ place, onPress }: DiscoverPlaceCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => onPress(place)}
      accessibilityRole="button"
      accessibilityLabel={t("discover.place_a11y", { place: place.name })}
      className="w-36 active:opacity-80"
    >
      <VStack space="xs">
        <ImagePlaceholder
          icon={ImageIcon}
          tint={place.tint}
          className="h-24 w-36 rounded-xl"
        />
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {place.name}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {place.type} · {t("discover.posts_count", { count: place.postsCount })}
        </Text>
      </VStack>
    </Pressable>
  );
}

export default React.memo(DiscoverPlaceCard);
