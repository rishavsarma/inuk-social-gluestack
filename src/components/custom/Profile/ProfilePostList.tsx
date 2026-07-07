import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { LayersIcon, MusicIcon, PlayIcon } from "lucide-react-native";
import { memo } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ProfileGridItem = ({
  item,
  imageSize,
  isDark,
  onPress,
}: {
  item: ProfileMediaItem;
  imageSize: number;
  isDark: boolean;
  onPress: () => void;
}) => {
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
    url: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${item.mediaId}/jpeg/720`,
  };

  const typeStr = (item.type || item.postType || "photo").toLowerCase();
  const isText = typeStr === "text";
  const isAudio = typeStr === "audio";
  const isVideo = typeStr === "video";
  const isCarousel = item.media && item.media.length > 1;

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
      accessibilityLabel={`View ${typeStr} post`}
      style={{ width: imageSize, height: imageSize, padding: 0.5 }}
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
        className="s bg-muted"
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
              {item.caption || "Text Post"}
            </Text>
          </LinearGradient>
        ) : isAudio ? (
          <LinearGradient
            colors={isDark ? ["#1e293b", "#0f172a"] : ["#f1f5f9", "#e2e8f0"]}
            style={{
              flex: 1,
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View className="mb-1 h-9 w-9 items-center justify-center rounded-full border border-theme/20 bg-theme/10 dark:bg-theme/20">
              <Icon as={MusicIcon} className="text-theme" />
            </View>
            <Text
              numberOfLines={1}
              className="max-w-[90%] text-center text-[9px] font-bold text-muted-foreground"
            >
              {item.caption || "Audio Post"}
            </Text>
          </LinearGradient>
        ) : (
          <View className="flex-1">
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
            />
            {isVideo && (
              <View className="absolute right-2 top-2 flex-row items-center gap-1 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md">
                <Icon
                  as={PlayIcon}
                  className="size-2"
                  color="#fff"
                  fill="#fff"
                />
              </View>
            )}
            {isCarousel && !isVideo && (
              <View className="absolute right-2 top-2 flex-row items-center justify-center rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md">
                <Icon
                  as={LayersIcon}
                  className="size-2"
                  color="#fff"
                  fill="#fff"
                />
              </View>
            )}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default memo(ProfileGridItem);
