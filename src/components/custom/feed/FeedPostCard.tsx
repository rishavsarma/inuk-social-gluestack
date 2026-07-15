import React from "react";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSettingStore } from "@/stores/setting.store";

import { FeedPostVideo } from "@/components/custom/feed/FeedPostVideo";

import { formatDistanceToNow } from "date-fns";

interface FeedPostCardProps {
  post: FeedPostItem;
  isFollowing: boolean;
  isFollowLoading: boolean;
  onPress: (post: FeedPostItem) => void;
  onCommentPress: (post: FeedPostItem) => void;
  onLikePress: (post: FeedPostItem) => void;
  onFollowPress: (post: FeedPostItem, isFollowing: boolean) => void;
  onMorePress: (post: FeedPostItem) => void;
  onSharePress: (post: FeedPostItem) => void;
}

function FeedPostCardComponent({
  post,
  isFollowing,
  isFollowLoading,
  onPress,
  onCommentPress,
  onLikePress,
  onFollowPress,
  onMorePress,
  onSharePress,
}: FeedPostCardProps) {
  const { t } = useTranslation();
  const { theme } = useSettingStore();
  const isDark = theme === "dark";

  const avatarUrl = post.author?.avatar_url ?? undefined;
  const displayName =
    post.author?.display_name || post.author?.username || t("common.user");
  const createdAt = post.created_at
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
    : "";
  const caption = post.caption || "";
  const mediaItem = post.media?.[0] ?? null;
  const mediaUrl = mediaItem?.url ?? null;
  const isLiked = !!post.is_liked;
  const likesCount = post.likes_count ?? 0;
  const commentsCount = post.comments_count ?? 0;
  const sharesCount = post.shares_count ?? 0;
  const isMe = post.author?.is_me ?? false;
  return (
    <Card className="gap-3 overflow-hidden rounded-md border-0 px-0 pb-0 ">
      <Pressable
        onPress={() => onPress(post)}
        accessibilityRole="button"
        accessibilityLabel={t("feed.view_post_a11y")}
      >
        <VStack space="sm">
          <HStack space="lg" className="justify-between items-center px-4">
            <HStack space="sm" className="flex-1 items-center ">
              <Avatar className="h-12 w-12">
                <AvatarFallbackText>{displayName}</AvatarFallbackText>

                <AvatarImage
                  source={{ uri: avatarUrl }}
                  alt={t("profile.avatar_alt", { name: displayName })}
                  className="w-full h-full"
                />
              </Avatar>
              <VStack className="">
                <Text
                  size="md"
                  bold
                  className="leading-none py-0 leading-0 font-baloo-bold "
                >
                  {displayName}
                </Text>
                <Text size="xs" className="leading-none text-muted-foreground">
                  {createdAt} Kunja
                </Text>
              </VStack>
            </HStack>
            {!isMe && (
              <Button
                variant={"theme"}
                size="sm"
                onPress={() => onFollowPress(post, isFollowing)}
                disabled={isFollowLoading}
                accessibilityRole="button"
                accessibilityLabel={
                  isFollowing
                    ? t("network.unfollow_a11y", { name: displayName })
                    : t("network.follow_a11y", { name: displayName })
                }
                className="border border-border/40"
              >
                <ButtonText className="">
                  {isFollowing
                    ? t("network.following_btn")
                    : t("network.follow")}
                </ButtonText>
              </Button>
            )}
            <Button
              size="default"
              variant="ghost"
              onPress={() => onMorePress(post)}
              accessibilityRole="button"
              accessibilityLabel={t("post_options.menu_a11y")}
              className="rounded-full p-0 data-[active=true]:bg-transparent"
            >
              <ButtonIcon as={MoreHorizontal} size="lg" className="" />
            </Button>
          </HStack>
          {caption && (
            <Text size="md" className="px-4">
              {caption.trim()}
            </Text>
          )}
          {!!mediaUrl && (
            <Box className="relative h-96 w-full overflow-hidden rounded-none bg-card">
              {post.type === "video" ? (
                <FeedPostVideo
                  id={String(post.id)}
                  uri={mediaUrl}
                  posterUri={mediaItem?.thumbnail_url}
                />
              ) : (
                <Image
                  source={{ uri: mediaUrl }}
                  alt={t("feed.post_image_alt")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={300}
                />
              )}
              <VStack className="absolute bottom-3 left-4 right-4 items-center">
                <View className="overflow-hidden rounded-full shadow-lg">
                  <BlurView
                    intensity={Platform.OS === "android" ? 100 : 70}
                    tint={isDark ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                  />

                  <HStack className="items-center bg-white/40 px-1 dark:bg-black/30">
                    <Pressable
                      onPress={() => onLikePress(post)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isLiked
                          ? t("post_detail.unlike_post")
                          : t("post_detail.like_post")
                      }
                    >
                      <HStack space="sm" className="items-center px-3 py-2">
                        <Icon
                          as={Heart}
                          size="sm"
                          className={
                            isLiked
                              ? "text-theme fill-theme"
                              : "text-foreground"
                          }
                        />
                        <Text
                          size="sm"
                          className="font-semibold text-foreground"
                        >
                          {likesCount}
                        </Text>
                      </HStack>
                    </Pressable>
                    <Divider
                      orientation="vertical"
                      className="h-4 w-px bg-foreground/20"
                    />
                    <Pressable
                      onPress={() => onCommentPress(post)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={t("post_detail.comments")}
                    >
                      <HStack space="sm" className="items-center px-3 py-2">
                        <Icon
                          as={MessageCircle}
                          size="sm"
                          className="text-foreground"
                        />
                        <Text
                          size="sm"
                          className="font-semibold text-foreground"
                        >
                          {commentsCount}
                        </Text>
                      </HStack>
                    </Pressable>
                    <Divider
                      orientation="vertical"
                      className="h-4 w-px bg-foreground/20"
                    />
                    <Pressable
                      onPress={() => onSharePress(post)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={t("post_detail.share_post")}
                    >
                      <HStack space="sm" className="items-center px-3 py-2">
                        <Icon
                          as={Share2}
                          size="sm"
                          className="text-foreground"
                        />
                        <Text
                          size="sm"
                          className=" font-semibold text-foreground"
                        >
                          {sharesCount}
                        </Text>
                      </HStack>
                    </Pressable>
                  </HStack>
                </View>
              </VStack>
            </Box>
          )}
        </VStack>
      </Pressable>
    </Card>
  );
}

export const FeedPostCard = React.memo(
  FeedPostCardComponent,
  (prev, next) =>
    prev.post === next.post &&
    prev.isFollowing === next.isFollowing &&
    prev.isFollowLoading === next.isFollowLoading,
);
