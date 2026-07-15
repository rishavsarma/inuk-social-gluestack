import React from "react";

import { ImageIcon, PlayIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { ImagePlaceholder } from "@/components/custom/ImagePlaceholder";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";

import { formatCompactNumber } from "@/utils/formatNumber";

interface DiscoverPostTileProps {
  post: DiscoverPost;
  onPress: (post: DiscoverPost) => void;
}

function DiscoverPostTile({ post, onPress }: DiscoverPostTileProps) {
  const { t } = useTranslation();
  const isVideo = post.type === "video";

  return (
    <Pressable
      onPress={() => onPress(post)}
      accessibilityRole="button"
      accessibilityLabel={t(
        isVideo ? "discover.video_post_a11y" : "discover.photo_post_a11y",
      )}
      className="aspect-square flex-1 active:opacity-80"
    >
      <ImagePlaceholder
        icon={isVideo ? PlayIcon : ImageIcon}
        tint="sky"
        className="h-full w-full gap-2 rounded-xl"
      >
        <Text size="xs" className="font-medium text-muted-foreground">
          {t("discover.likes_count", {
            value: formatCompactNumber(post.likesCount),
          })}
        </Text>
      </ImagePlaceholder>
    </Pressable>
  );
}

export default React.memo(DiscoverPostTile);
