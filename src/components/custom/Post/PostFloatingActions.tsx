import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { HeartIcon, MessageCircleIcon, Share2Icon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}K`;
  return String(n);
}

interface PostFloatingActionsProps {
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  bottomInset?: number;
  likeAnimStyle?: any;
  onLike?: () => void;
  onShare?: () => void;
  onComment?: () => void;
}

export function PostFloatingActions({
  likesCount = 0,
  commentsCount = 0,
  isLiked = false,
  bottomInset = 0,
  likeAnimStyle,
  onLike,
  onShare,
  onComment,
}: PostFloatingActionsProps) {
  const { t } = useTranslation();
  const likeScale = useSharedValue(1);
  const bounceAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const handleLikePress = () => {
    likeScale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withTiming(1, { duration: 120 }),
    );
    onLike?.();
  };

  return (
    <View
      style={{ paddingBottom: Math.max(bottomInset, 16) }}
      className="pointer-events-box-none absolute bottom-0 left-0 right-0 items-center justify-end px-6 z-10"
    >
      <View className="w-full max-w-55 flex-row items-center justify-between rounded-full border border-background/5 bg-card/90 px-5 py-3.5 backdrop-blur-3xl dark:border-white/10 dark:bg-[#1a1a1a]/85">
        {/* Like */}
        <Animated.View style={[likeAnimStyle, bounceAnimStyle]}>
          <Pressable
            onPress={handleLikePress}
            hitSlop={12}
            className="flex-row items-center gap-1.5"
            accessibilityRole="button"
            accessibilityLabel={
              isLiked
                ? t("post_detail.unlike_post")
                : t("post_detail.like_post")
            }
            accessibilityHint={t("post_detail.like_hint")}
          >
            <Icon
              as={HeartIcon}
              className={isLiked ? "text-theme fill-theme" : "text-foreground"}
            />
            <Text
              size="sm"
              className={cn(
                " font-medium tracking-wide",
                isLiked ? "text-theme" : "text-foreground",
              )}
            >
              {fmt(likesCount)}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Separator */}
        <View className="h-4 w-px rounded-full bg-foreground/10" />

        {/* Comment */}
        <Pressable
          onPress={onComment}
          hitSlop={12}
          className="flex-row items-center gap-1.5"
          accessibilityRole="button"
          accessibilityLabel={t("post_detail.comments")}
          accessibilityHint={t("post_detail.comments_hint")}
        >
          <Icon size="sm" as={MessageCircleIcon} className="text-foreground" />
          <Text size="sm" className="font-medium tracking-wide text-foreground">
            {fmt(commentsCount)}
          </Text>
        </Pressable>

        {/* Separator */}
        <View className="h-4 w-px rounded-full bg-foreground/10" />

        {/* Share */}
        <Pressable
          onPress={onShare}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t("post_detail.share_post")}
          accessibilityHint={t("post_detail.share_hint")}
          className="flex-row items-center gap-1.5"
        >
          <Icon size="sm" as={Share2Icon} className="text-foreground/80" />
        </Pressable>
      </View>
    </View>
  );
}
