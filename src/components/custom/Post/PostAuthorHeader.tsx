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
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { SlidersHorizontal } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

interface PostAuthorHeaderProps {
  post: PostDetail;
  onOptionsPress?: () => void;
}

function PostAuthorHeader({ post, onOptionsPress }: PostAuthorHeaderProps) {
  const { t } = useTranslation();
  const createdAt = useTimeAgo(post.post.created_at);

  return (
    <HStack space="md" className="items-center justify-between">
      <HStack space="md" className="flex-1 items-center">
        <Avatar className="h-14 w-14 border-2 border-white/30">
          <AvatarFallbackText>{post.author.display_name}</AvatarFallbackText>
          <AvatarImage source={{ uri: post.author.avatar_url }} />
        </Avatar>
        <VStack className="items-start justify-start">
          <Heading size="md" className="text-white">
            {post.author.display_name}
          </Heading>
          <Text size="sm" className="text-white/70">
            {createdAt || `@${post.author.username}`}
          </Text>
        </VStack>
      </HStack>
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
