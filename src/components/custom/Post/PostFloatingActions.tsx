import { Icon } from "@/components/ui/icon";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { HeartIcon, MessageCircleIcon, Share2Icon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}K`;
  return String(n);
}

interface PostFloatingActionsProps {
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  isDark?: boolean;
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
  isDark = false,
  bottomInset = 0,
  likeAnimStyle,
  onLike,
  onShare,
  onComment,
}: PostFloatingActionsProps) {
  return (
    <View
      style={{ paddingBottom: Math.max(bottomInset, 16) }}
      className="pointer-events-box-none absolute bottom-0 left-0 right-0 items-center justify-end px-6 z-10"
    >
      <View className="w-full max-w-[220px] flex-row items-center justify-between rounded-full border border-background/5 bg-background/85 px-5 py-2.5 backdrop-blur-3xl dark:border-white/10 dark:bg-[#1a1a1a]/85">
        {/* Like */}
        <Animated.View style={likeAnimStyle}>
          <Pressable
            onPress={onLike}
            hitSlop={12}
            className="flex-row items-center gap-1.5"
            accessibilityRole="button"
            accessibilityLabel={isLiked ? "Unlike post" : "Like post"}
            accessibilityHint="Toggles the like status of this post"
          >
            <Icon
              as={HeartIcon}
              color={isLiked ? "#E50914" : isDark ? "#fff" : "#000"}
              fill={isLiked ? "#E50914" : "transparent"}
            />
            <Text
              className={cn(
                "text-[13px] font-medium tracking-wide",
                isLiked ? "text-theme" : "text-foreground",
              )}
            >
              {fmt(likesCount)}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Separator */}
        <View className="h-4 w-[1px] rounded-full bg-foreground/10" />

        {/* Comment */}
        <Pressable
          onPress={onComment}
          hitSlop={12}
          className="flex-row items-center gap-1.5"
          accessibilityRole="button"
          accessibilityLabel="Comments"
          accessibilityHint="Opens the comments section for this post"
        >
          <Icon as={MessageCircleIcon} className="text-foreground" />
          <Text className="text-[13px] font-medium tracking-wide text-foreground">
            {fmt(commentsCount)}
          </Text>
        </Pressable>

        {/* Separator */}
        <View className="h-4 w-[1px] rounded-full bg-foreground/10" />

        {/* Share */}
        <Pressable
          onPress={onShare}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Share post"
          accessibilityHint="Opens the share menu to send this post to others"
        >
          <Icon as={Share2Icon} className="text-foreground" />
        </Pressable>
      </View>
    </View>
  );
}
