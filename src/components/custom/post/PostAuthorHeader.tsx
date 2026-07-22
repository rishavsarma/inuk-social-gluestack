import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { SlidersHorizontal } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { FollowButton } from "@/components/custom/FollowButton";

interface PostAuthorHeaderProps {
  post: PostDetail;
  onOptionsPress?: () => void;
  onFollowPress?: () => void;
  isFollowLoading?: boolean;
}

function PostAuthorHeader({
  post,
  onOptionsPress,
  onFollowPress,
  isFollowLoading,
}: PostAuthorHeaderProps) {
  const { t } = useTranslation();
  const createdAt = useTimeAgo(post.post.created_at);
  const isFollowing = post.author.is_following;

  return (
    <HStack space="md" className="items-center justify-between">
      <HStack space="sm" className="flex-1 items-center">
        <Avatar className="h-14 w-14 border-2 border-white/30">
          <AvatarFallbackText>{post.author.display_name}</AvatarFallbackText>
          <AvatarImage
            source={{ uri: post.author.avatar_url }}
            alt={t("profile.avatar_alt", { name: post.author.display_name })}
          />
        </Avatar>
        <VStack className="items-start justify-start">
          <Heading size="md" className="text-white">
            {post.author.display_name}
          </Heading>
          <Text size="sm" className="text-white">
            {createdAt || `@${post.author.username}`}
          </Text>
        </VStack>
      </HStack>
      {!post.author.is_me && (
        <FollowButton
          isFollowing={isFollowing}
          isFollowLoading={isFollowLoading}
          displayName={post.author.display_name}
          onPress={onFollowPress}
          variant="overlay"
        />
      )}
      {onOptionsPress && (
        <Pressable
          onPress={onOptionsPress}
          accessibilityRole="button"
          accessibilityLabel={t("post_detail.post_options")}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center"
        >
          <Icon as={SlidersHorizontal} size="md" className="text-white" />
        </Pressable>
      )}
    </HStack>
  );
}

export default PostAuthorHeader;
