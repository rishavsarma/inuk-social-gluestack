import { useCallback, useMemo, useState } from "react";

import { Href, router } from "expo-router";

import { Share, type LayoutChangeEvent } from "react-native";

import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import {
  FlashList,
  type ListRenderItemInfo,
  type ViewToken,
} from "@shopify/flash-list";
import { CloudOff, ImageOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/stores/auth.store";
import { useFeedVideoStore } from "@/stores/feed-video.store";
import { useFollowStore } from "@/stores/follow.store";

import { useFeedPostsList, useLikeFeedPostMutation } from "@/hooks/usePosts";
import { useFollowUser } from "@/hooks/useProfile";

import { EmptyState } from "@/components/custom/feed/EmptyState";
import { FeedCategories } from "@/components/custom/feed/FeedCategories";
import FeedHeader from "@/components/custom/feed/FeedHeader";
import { FeedPostCardV2 } from "@/components/custom/feed/FeedPostCardV2";
import { PostSkeleton } from "@/components/custom/feed/PostSkeleton";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { PostOptionsActionsheet } from "@/components/custom/post/PostOptionsActionsheet";

import { ROUTES } from "@/routes";

const FeedScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const {
    posts: feedPosts,
    isLoading,
    isError,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFeedPostsList();
  const likeMutation = useLikeFeedPostMutation();
  const currentUserId = useAuthStore((state) => state.user?.profileId);
  const {
    mutate: toggleFollow,
    variables: followVariables,
    isPending: isFollowPending,
  } = useFollowUser();
  const followOverrides = useFollowStore((state) => state.overrides);
  const setFollowOverride = useFollowStore((state) => state.setFollowOverride);

  const [feedHeaderHeight, setFeedHeaderHeight] = useState(0);
  const handleFeedHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setFeedHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  const [hiddenPostIds, setHiddenPostIds] = useState<Set<string>>(new Set());
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [activeOptionsPost, setActiveOptionsPost] = useState<{
    postId: string;
    authorId: string | number | undefined;
  } | null>(null);

  const posts = useMemo(
    () =>
      feedPosts.filter(
        (post: FeedPostItem) => !hiddenPostIds.has(String(post.id)),
      ),
    [feedPosts, hiddenPostIds],
  );

  const showFeedbackToast = useCallback(
    (message: string) => {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="success" variant="solid">
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        ),
      });
    },
    [toast],
  );

  const handleOptionsPress = useCallback(
    (postId: string, authorId: string | number | undefined) => {
      setActiveOptionsPost({ postId, authorId });
    },
    [],
  );

  const handleCloseOptions = useCallback(() => {
    setActiveOptionsPost(null);
  }, []);

  const handleSavePost = useCallback(() => {
    if (!activeOptionsPost) return;
    const { postId } = activeOptionsPost;
    setSavedPostIds((prev) => {
      const next = new Set(prev);
      const wasSaved = next.has(postId);
      if (wasSaved) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      showFeedbackToast(
        wasSaved ? t("post_options.unsaved") : t("post_options.saved"),
      );
      return next;
    });
  }, [activeOptionsPost, showFeedbackToast, t]);

  const handleAboutAccount = useCallback(() => {
    if (!activeOptionsPost?.authorId) return;
    router.push(ROUTES.USER.PROFILE(activeOptionsPost.authorId) as Href);
  }, [activeOptionsPost]);

  const handleFollowPress = useCallback(
    (authorId: string | undefined, isFollowing: boolean) => {
      if (!authorId || !currentUserId) return;
      setFollowOverride(authorId, !isFollowing);
      toggleFollow({
        followerId: currentUserId,
        followedId: authorId,
        action: isFollowing ? "UNFOLLOW" : "FOLLOW",
      });
    },
    [currentUserId, toggleFollow, setFollowOverride],
  );

  const handleWhySeeingThis = useCallback(() => {
    showFeedbackToast(t("post_options.why_seeing_this_post"));
  }, [showFeedbackToast, t]);

  const handleInterested = useCallback(() => {
    showFeedbackToast(t("post_options.marked_interested"));
  }, [showFeedbackToast, t]);

  const handleNotInterested = useCallback(() => {
    showFeedbackToast(t("post_options.marked_not_interested"));
  }, [showFeedbackToast, t]);

  const handleHidePost = useCallback(() => {
    if (!activeOptionsPost) return;
    const { postId } = activeOptionsPost;
    setHiddenPostIds((prev) => new Set(prev).add(postId));
    showFeedbackToast(t("post_options.hidden"));
  }, [activeOptionsPost, showFeedbackToast, t]);

  const handleReportPost = useCallback(() => {
    showFeedbackToast(t("post_options.reported"));
  }, [showFeedbackToast, t]);

  const setActiveVideoId = useFeedVideoStore((s) => s.setActiveVideoId);
  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 60, minimumViewTime: 150 }),
    [],
  );
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<FeedPostItem>[] }) => {
      const activeVideo = viewableItems.find(
        (token) => token.isViewable && token.item?.type === "video",
      );
      setActiveVideoId(activeVideo ? String(activeVideo.item.id) : null);
    },
    [setActiveVideoId],
  );

  const handlePostPress = useCallback((post: FeedPostItem) => {
    const postMediaId = post.media?.[0]?.id;
    if (!postMediaId || !post.id) return;
    router.push(
      `${ROUTES.CONTENT.POST_DETAILS(
        postMediaId,
        String(post.id),
      )}?id=${postMediaId}&profile_id=${post.author?.id}&type=${post.type}` as Href,
    );
  }, []);

  const handleProfilePress = useCallback((post: FeedPostItem) => {
    const postMediaId = post.media?.[0]?.id;
    const authorId = post.author?.id;
    if (!postMediaId || !post.id || !authorId) return;
    router.push(ROUTES.USER.PROFILE(authorId) as Href);
  }, []);

  const handleCommentPress = useCallback((post: FeedPostItem) => {
    const postMediaId = post.media?.[0]?.id;
    if (!postMediaId || !post.id) return;
    router.push(
      `${ROUTES.CONTENT.POST_DETAILS(
        postMediaId,
        String(post.id),
      )}?id=${postMediaId}&profile_id=${post.author?.id}&type=${post.type}&comments=true` as Href,
    );
  }, []);

  const handleLikePress = useCallback(
    (post: FeedPostItem) => {
      if (!post.id) return;
      likeMutation.mutate({
        postId: String(post.id),
        isLiked: !!post.is_liked,
      });
    },
    [likeMutation],
  );

  const handleMorePress = useCallback(
    (post: FeedPostItem) => {
      if (!post.id) return;
      handleOptionsPress(String(post.id), post.author?.id);
    },
    [handleOptionsPress],
  );

  const handleSharePress = useCallback(async (post: FeedPostItem) => {
    try {
      const mediaUrl = post.media?.[0]?.url;
      await Share.share({
        message: post.caption || "",
        ...(mediaUrl ? { url: mediaUrl } : {}),
      });
    } catch {
      // user dismissed the share sheet — nothing to do
    }
  }, []);

  const handleCardFollowPress = useCallback(
    (post: FeedPostItem, isFollowing: boolean) => {
      handleFollowPress(post.author?.id, isFollowing);
    },
    [handleFollowPress],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FeedPostItem>) => {
      const authorId = item.author?.id;
      const isFollowing =
        followOverrides[authorId ?? ""] ?? !!item.author?.is_following;
      const isFollowLoading =
        isFollowPending && followVariables?.followedId === authorId;

      return (
        <FeedPostCardV2
          post={item}
          isFollowing={isFollowing}
          isFollowLoading={isFollowLoading}
          onPress={handlePostPress}
          onProfilePress={handleProfilePress}
          onCommentPress={handleCommentPress}
          onLikePress={handleLikePress}
          onFollowPress={handleCardFollowPress}
          onMorePress={handleMorePress}
          onSharePress={handleSharePress}
        />
      );
    },
    [
      followOverrides,
      isFollowPending,
      followVariables,
      handlePostPress,
      handleProfilePress,
      handleCommentPress,
      handleLikePress,
      handleCardFollowPress,
      handleMorePress,
      handleSharePress,
    ],
  );

  return (
    <>
      <KeyboardAvoidingScrollView variant="list">
        {({ scrollProps, topInset }) => (
          <FlashList
            data={posts}
            extraData={posts}
            keyExtractor={(item: FeedPostItem) => String(item.id)}
            renderItem={renderItem}
            {...scrollProps}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={handleViewableItemsChanged}
            drawDistance={800}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: topInset, paddingBottom: 160 }}
            ListHeaderComponent={
              <>
                <Box onLayout={handleFeedHeaderLayout}>
                  <FeedHeader />
                </Box>
                {/* <Text className="px-4 pt-1 text-xs font-semibold text-muted-foreground">
                  A · Rounded-square
                </Text> */}
                <FeedCategories variant="rounded" />
                {/* <Text className="px-4 pt-1 text-xs font-semibold text-muted-foreground">
                  C · Glossy gradient
                </Text>
                <FeedCategories variant="glossy" /> */}
              </>
            }
            ItemSeparatorComponent={() => <Box className="h-4" />}
            ListEmptyComponent={
              isLoading ? (
                <VStack space="lg" className="pt-4">
                  <PostSkeleton />
                  <PostSkeleton />
                </VStack>
              ) : isError ? (
                <EmptyState
                  icon={CloudOff}
                  title={t("feed.error_title")}
                  description={t("common.error_loading")}
                  actionLabel={t("common.retry")}
                  onAction={refetch}
                />
              ) : (
                <EmptyState
                  icon={ImageOff}
                  title={t("feed.empty")}
                  description={t("feed.placeholder")}
                />
              )
            }
            refreshing={isRefetching}
            progressViewOffset={topInset + feedHeaderHeight}
            onRefresh={refetch}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <Box className="items-center py-6">
                  <Spinner />
                </Box>
              ) : null
            }
          />
        )}
      </KeyboardAvoidingScrollView>
      <PostOptionsActionsheet
        isOpen={!!activeOptionsPost}
        onClose={handleCloseOptions}
        isSaved={
          !!activeOptionsPost && savedPostIds.has(activeOptionsPost.postId)
        }
        onSave={handleSavePost}
        onAboutAccount={handleAboutAccount}
        onWhySeeingThis={handleWhySeeingThis}
        onInterested={handleInterested}
        onNotInterested={handleNotInterested}
        onHide={handleHidePost}
        onReport={handleReportPost}
      />
    </>
  );
};

export default FeedScreen;
