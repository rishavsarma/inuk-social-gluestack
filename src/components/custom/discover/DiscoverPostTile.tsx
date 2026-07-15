import React from "react";

import { ImageIcon, PlayIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

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
      className="aspect-square flex-1 items-center justify-center gap-2 rounded-xl bg-muted active:opacity-80"
    >
      <Icon
        as={isVideo ? PlayIcon : ImageIcon}
        size="xl"
        className="text-muted-foreground/60"
      />
      <Text size="xs" className="font-medium text-muted-foreground">
        {t("discover.likes_count", {
          value: formatCompactNumber(post.likesCount),
        })}
      </Text>
    </Pressable>
  );
}

export default React.memo(DiscoverPostTile);
