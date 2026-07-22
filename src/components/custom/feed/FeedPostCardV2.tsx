import React from "react";

import { Image } from "expo-image";
import { Href, router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import {
  BadgeCheck,
  Bookmark,
  Dot,
  Heart,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  MoreHorizontal,
  MoreVertical,
  SendHorizontal,
  Share,
  Share2,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useTimeAgo } from "@/hooks/useTimeAgo";

import { FollowButton } from "@/components/custom/FollowButton";
import { FeedPostVideo } from "@/components/custom/feed/FeedPostVideo";

import { formatCompactNumber } from "@/utils/formatNumber";

import { POST_CONSTANTS } from "@/constants";
import { ROUTES } from "@/routes";
import { Badge, BadgeIcon } from "@/components/ui/badge";

const MEDIA_HEIGHT = POST_CONSTANTS.SCREEN_WIDTH * 1.25;

interface FeedPostCardV2Props {
  post: FeedPostItem;
  isFollowing: boolean;
  isFollowLoading: boolean;
  onPress: (post: FeedPostItem) => void;
  onProfilePress: (post: FeedPostItem) => void;
  onCommentPress: (post: FeedPostItem) => void;
  onLikePress: (post: FeedPostItem) => void;
  onFollowPress: (post: FeedPostItem, isFollowing: boolean) => void;
  onMorePress: (post: FeedPostItem) => void;
  onSharePress: (post: FeedPostItem) => void;
}

function FeedPostCardV2Component({
  post,
  isFollowing,
  isFollowLoading,
  onPress,
  onProfilePress,
  onCommentPress,
  onLikePress,
  onFollowPress,
  onMorePress,
  onSharePress,
}: FeedPostCardV2Props) {
  const { t } = useTranslation();
  const createdAt = useTimeAgo(post.created_at) + " ago";

  const [isSaved, setIsSaved] = React.useState(!!post.is_saved);
  const [isCaptionExpanded, setIsCaptionExpanded] = React.useState(false);
  const [isCaptionTruncated, setIsCaptionTruncated] = React.useState(false);
  const [isCaptionMeasured, setIsCaptionMeasured] = React.useState(false);
  const [captionWidth, setCaptionWidth] = React.useState(0);

  const avatarUrl = post.author?.avatar_url ?? undefined;
  const displayName =
    post.author?.username || post.author?.display_name || t("common.user");
  const location = post.location || "";
  const locationId = post.location_id || null;
  const handleLocationPress = () => {
    if (!locationId) return;
    router.push(ROUTES.TABS.DISCOVER as Href);
  };
  const caption = post.caption?.trim() || "";
  const mediaItem = post.media?.[0] ?? null;
  const mediaUrl = mediaItem?.url ?? null;
  const isLiked = !!post.is_liked;
  const likesCount = post.likes_count ?? 0;
  const commentsCount = post.comments_count ?? 0;
  const sharesCount = post.shares_count ?? 0;
  const isMe = post.author?.is_me ?? false;

  return (
    <Card className="gap-2 overflow-hidden rounded-none border-0 px-0  shadow-none">
      <HStack space="lg" className="items-center justify-between px-2">
        <Pressable onPress={() => onProfilePress(post)} className="flex-1">
          <HStack space="sm" className="flex-1 items-center">
            <Avatar className="h-12 w-12">
              <AvatarFallbackText>{displayName}</AvatarFallbackText>
              <AvatarImage
                source={{ uri: avatarUrl }}
                alt={t("profile.avatar_alt", { name: displayName })}
                className="h-full w-full"
              />
            </Avatar>
            <VStack>
              <HStack space="xs" className="items-center">
                <Text size="md" className="py-0 font-baloo-bold">
                  {displayName}
                </Text>
                <Icon as={BadgeCheck} className="h-4 w-4 text-green-600" />
              </HStack>
              <HStack className="items-center">
                <Text size="xs" className=" text-muted-foreground">
                  {createdAt}
                </Text>
                {location ? (
                  <>
                    <Icon as={Dot} size="sm" />
                    <Pressable
                      onPress={handleLocationPress}
                      disabled={!locationId}
                      hitSlop={8}
                      accessibilityRole={locationId ? "button" : undefined}
                      accessibilityLabel={location}
                    >
                      <Text size="xs" className=" text-muted-foreground">
                        {location}
                      </Text>
                    </Pressable>
                  </>
                ) : null}
              </HStack>
            </VStack>
          </HStack>
        </Pressable>
        <HStack space="sm" className="items-center">
          {!isMe && (
            <FollowButton
              isFollowing={isFollowing}
              isFollowLoading={isFollowLoading}
              displayName={displayName}
              onPress={() => onFollowPress(post, isFollowing)}
              size="sm"
              variant="default"
            />
          )}
          <Button
            size="default"
            variant="ghost"
            onPress={() => onMorePress(post)}
            accessibilityRole="button"
            accessibilityLabel={t("post_options.menu_a11y")}
            className="rounded-full p-0 data-[active=true]:bg-transparent"
          >
            <ButtonIcon as={MoreVertical} size="lg" />
          </Button>
        </HStack>
      </HStack>

      {!!mediaUrl && (
        <Pressable
          onPress={() => onPress(post)}
          accessibilityRole="button"
          accessibilityLabel={t("feed.view_post_a11y")}
        >
          <Box
            className="relative w-full overflow-hidden bg-card"
            style={{ height: MEDIA_HEIGHT }}
          >
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
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={300}
              />
            )}
          </Box>
        </Pressable>
      )}

      <VStack space="xs" className="px-3">
        <HStack className="items-center justify-between  py-2">
          <HStack space="lg" className="items-center">
            <Pressable
              onPress={() => onLikePress(post)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                isLiked
                  ? t("post_detail.unlike_post")
                  : t("post_detail.like_post")
              }
            >
              <HStack space="xs" className="items-center">
                <Icon
                  as={Heart}
                  size="xl"
                  className={
                    isLiked ? "text-theme fill-theme" : "text-foreground"
                  }
                />
                <Text size="sm" className="font-semibold text-foreground">
                  {formatCompactNumber(likesCount)}
                </Text>
              </HStack>
            </Pressable>
            <Pressable
              onPress={() => onCommentPress(post)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t("post_detail.comments")}
            >
              <HStack space="xs" className="items-center">
                <Icon
                  as={MessageSquare}
                  size="lg"
                  className="text-foreground"
                />
                <Text size="sm" className="font-semibold text-foreground">
                  {formatCompactNumber(commentsCount)}
                </Text>
              </HStack>
            </Pressable>
            <Pressable
              onPress={() => onSharePress(post)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t("post_detail.share_post")}
            >
              <HStack space="xs" className="items-center">
                <Icon as={Share2} size="lg" className="text-foreground" />
                <Text size="sm" className="font-semibold text-foreground">
                  {formatCompactNumber(sharesCount)}
                </Text>
              </HStack>
            </Pressable>
          </HStack>
          <Pressable
            onPress={() => setIsSaved((prev) => !prev)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={
              isSaved ? t("post_options.unsaved") : t("post_options.save")
            }
          >
            <Icon
              as={Bookmark}
              size="xl"
              className={
                isSaved ? "fill-foreground text-foreground" : "text-foreground"
              }
            />
          </Pressable>
        </HStack>

        {!!caption && (
          <VStack
            space="xs"
            className="pb-1"
            onLayout={(e) => {
              if (captionWidth === 0) {
                setCaptionWidth(e.nativeEvent.layout.width);
              }
            }}
          >
            {!isCaptionMeasured && captionWidth > 0 && (
              <Text
                size="sm"
                className="text-foreground"
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: captionWidth,
                }}
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                onTextLayout={(e) => {
                  setIsCaptionTruncated(e.nativeEvent.lines.length > 2);
                  setIsCaptionMeasured(true);
                }}
              >
                {caption}
              </Text>
            )}
            <Text
              size="sm"
              className="text-foreground"
              numberOfLines={isCaptionExpanded ? undefined : 2}
              style={!isCaptionMeasured ? { opacity: 0 } : undefined}
            >
              {caption}
            </Text>
            {isCaptionTruncated && (
              <Pressable
                onPress={() => setIsCaptionExpanded((prev) => !prev)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={
                  isCaptionExpanded ? t("feed.show_less") : t("feed.show_more")
                }
              >
                <Text size="sm" className="text-muted-foreground">
                  {isCaptionExpanded
                    ? t("feed.show_less")
                    : t("feed.show_more")}
                </Text>
              </Pressable>
            )}
          </VStack>
        )}
      </VStack>
    </Card>
  );
}

export const FeedPostCardV2 = React.memo(
  FeedPostCardV2Component,
  (prev, next) =>
    prev.post === next.post &&
    prev.isFollowing === next.isFollowing &&
    prev.isFollowLoading === next.isFollowLoading,
);
