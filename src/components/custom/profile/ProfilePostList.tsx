import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ImageOff, LayersIcon, MusicIcon, PlayIcon } from "lucide-react-native";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

function ProfileGridItem({
  item,
  type,
  imageSize,
  isDark,
  onPress,
}: {
  item: ProfileMediaItem;
  type: string;
  imageSize: number;
  isDark: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const postData = {
    blur_hash: item.blurHash,
    created_at: item.dateCreated,
    media_id: item.mediaId,
    post_id: item.postId,
    profile_id: item.profileId,
    type: type,
    url:
      type === "video"
        ? item.thumbnailUrl
        : `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${item.mediaId}/jpeg/720`,
  };

  const typeStr = (item.type || item.postType || "photo").toLowerCase();
  const isText = typeStr === "text";
  const isAudio = typeStr === "audio";
  const isVideo = typeStr === "video";
  const isCarousel = item.media && item.media.length > 1;

  const [erroredUrl, setErroredUrl] = useState<string | null>(null);
  const hasImageError = erroredUrl === postData.url;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.set(withTiming(0.95, { duration: 100 }));
      }}
      onPressOut={() => {
        scale.set(withTiming(1, { duration: 150 }));
      }}
      accessibilityRole="button"
      accessibilityLabel={t("profile.view_post", { type: typeStr })}
      style={{ width: imageSize, height: imageSize, padding: 0.5 }}
      className="bg-card"
    >
      <Animated.View
        style={[
          {
            flex: 1,
            overflow: "hidden",
            borderRadius: isText || isAudio ? 12 : 0,
          },
          animatedStyle,
        ]}
        className="bg-background"
      >
        {isText ? (
          <LinearGradient
            colors={isDark ? ["#1e1b4b", "#311042"] : ["#e0e7ff", "#fae8ff"]}
            style={{
              flex: 1,
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              numberOfLines={4}
              className="text-center text-[11px] font-semibold leading-snug tracking-tight text-foreground/90"
            >
              {item.caption || t("profile.text_post_fallback")}
            </Text>
          </LinearGradient>
        ) : (
          <View className="flex-1">
            {hasImageError ? (
              <View className="flex-1 items-center justify-center bg-muted">
                <Icon as={ImageOff} className="size-5 text-muted-foreground" />
              </View>
            ) : (
              <Image
                source={{ uri: postData.url }}
                placeholder={
                  postData.blur_hash
                    ? { blurhash: postData.blur_hash, width: 16, height: 16 }
                    : undefined
                }
                style={{ flex: 1 }}
                contentFit="cover"
                transition={200}
                onError={() => setErroredUrl(postData.url)}
                alt={t("profile.post_thumbnail_alt", { type: typeStr })}
              />
            )}
            {isVideo && !hasImageError && (
              <Box className="absolute right-2 top-2 flex-row items-center gap-1 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md">
                <Icon as={PlayIcon} className="size-2 text-white fill-white" />
              </Box>
            )}
            {isCarousel && !isVideo && !hasImageError && (
              <View className="absolute right-2 top-2 flex-row items-center justify-center rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md">
                <Icon
                  as={LayersIcon}
                  className="size-2 text-white fill-white"
                />
              </View>
            )}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default memo(ProfileGridItem);
