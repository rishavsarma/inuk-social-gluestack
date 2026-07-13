import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { SlidersHorizontal, UserPlus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

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
      <HStack space="md" className="flex-1 items-center">
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
        <Button
          variant={"theme"}
          className="rounded-full"
          onPress={onFollowPress}
          disabled={isFollowLoading}
          accessibilityRole="button"
          accessibilityLabel={
            isFollowing
              ? t("network.unfollow_a11y", { name: post.author.display_name })
              : t("network.follow_a11y", { name: post.author.display_name })
          }
        >
          {isFollowLoading ? (
            <ButtonSpinner color={isFollowing ? undefined : "white"} />
          ) : (
            <>
              <ButtonIcon
                as={UserPlus}
                className={isFollowing ? "" : "text-white"}
              />
              <ButtonText className={isFollowing ? "" : "text-white"}>
                {isFollowing ? t("network.following_btn") : t("network.follow")}
              </ButtonText>
            </>
          )}
        </Button>
      )}
      <Pressable
        onPress={onOptionsPress}
        accessibilityRole="button"
        accessibilityLabel={t("post_detail.post_options")}
        hitSlop={8}
        className="h-10 w-10 items-center justify-center"
      >
        <Icon as={SlidersHorizontal} size="md" className="text-white" />
      </Pressable>
    </HStack>
  );
}

export default PostAuthorHeader;
