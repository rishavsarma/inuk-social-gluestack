import { useCallback, useMemo, useState } from "react";

import { Href, router } from "expo-router";

import { Share } from "react-native";

import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import {
  FlashList,
  type ListRenderItemInfo,
  type ViewToken,
} from "@shopify/flash-list";
import { ImageOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/stores/auth.store";
import { useFeedVideoStore } from "@/stores/feed-video.store";

import { useGetFeedPosts, useLikeFeedPostMutation } from "@/hooks/usePosts";
import { useFollowUser } from "@/hooks/useProfile";

import { EmptyState } from "@/components/custom/Feed/EmptyState";
import { FeedCategories } from "@/components/custom/Feed/FeedCategories";
import FeedHeader from "@/components/custom/Feed/FeedHeader";
import { FeedPostCard, type FeedPostItem } from "@/components/custom/Feed/FeedPostCard";
import { PostSkeleton } from "@/components/custom/Feed/PostSkeleton";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { PostOptionsActionsheet } from "@/components/custom/Post/PostOptionsActionsheet";

import { ROUTES } from "@/routes";

interface FeedPostsPage {
  data?: FeedPostItem[];
  offset?: number;
  total?: number;
  limit?: number;
}

const FeedScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const {
    data: postsData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetFeedPosts();
  const likeMutation = useLikeFeedPostMutation();
  const currentUserId = useAuthStore((state) => state.user?.profileId);
  const {
    mutate: toggleFollow,
    variables: followVariables,
    isPending: isFollowPending,
  } = useFollowUser();
  const [followOverrides, setFollowOverrides] = useState<
    Record<string, boolean>
  >({});
  // postService.getFeedPosts's declared return type (PostDetail, a nested
  // shape meant for the single-post-detail screen) doesn't match the flat
  // item shape it actually returns for the feed list — re-typed here at the
  // consumption boundary to match what this screen actually reads.
  const feedPosts = useMemo(
    () =>
      (postsData?.pages as unknown as FeedPostsPage[] | undefined)?.flatMap(
        (page) => page?.data ?? [],
      ) ?? [],
    [postsData],
  );

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
      setFollowOverrides((prev) => ({ ...prev, [authorId]: !isFollowing }));
      toggleFollow({
        followerId: currentUserId,
        followedId: authorId,
        action: isFollowing ? "UNFOLLOW" : "FOLLOW",
      });
    },
    [currentUserId, toggleFollow],
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
      likeMutation.mutate({ postId: String(post.id), isLiked: !!post.is_liked });
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
        <FeedPostCard
          post={item}
          isFollowing={isFollowing}
          isFollowLoading={isFollowLoading}
          onPress={handlePostPress}
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
                <FeedHeader />
                {/* <ThemeSwitcher /> */}
                <FeedCategories />
              </>
            }
            ItemSeparatorComponent={() => <Box className="h-4" />}
            ListEmptyComponent={
              isLoading ? (
                <VStack space="lg" className="pt-4">
                  <PostSkeleton />
                  <PostSkeleton />
                </VStack>
              ) : (
                <EmptyState
                  icon={ImageOff}
                  title={t("feed.empty")}
                  description={t("feed.placeholder")}
                />
              )
            }
            refreshing={isRefetching}
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
