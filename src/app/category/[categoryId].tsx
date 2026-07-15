import { useCallback, useMemo, useState } from "react";

import { router, useLocalSearchParams, type Href } from "expo-router";

import { Share } from "react-native";

import { Image } from "expo-image";
import {
  FlashList,
  type ListRenderItemInfo,
  type ViewToken,
} from "@shopify/flash-list";
import { HelpCircle, ImageOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/stores/auth.store";
import { useFeedVideoStore } from "@/stores/feed-video.store";
import { useFollowStore } from "@/stores/follow.store";

import { useFeedPostsList, useLikeFeedPostMutation } from "@/hooks/usePosts";
import { useFollowUser } from "@/hooks/useProfile";

import ArenaQuizCard from "@/components/custom/arena/ArenaQuizCard";
import { EmptyState } from "@/components/custom/feed/EmptyState";
import { FeedPostCard } from "@/components/custom/feed/FeedPostCard";
import { PostSkeleton } from "@/components/custom/feed/PostSkeleton";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { PostOptionsActionsheet } from "@/components/custom/post/PostOptionsActionsheet";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { FEED_CATEGORIES, MOCK_ARENA_QUIZZES } from "@/constants/mock-data";
import { ROUTES } from "@/routes";

type CategoryTab = "posts" | "photo" | "video" | "quizzes";
const CATEGORY_TABS: CategoryTab[] = ["posts", "photo", "video", "quizzes"];

const CategoryScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  const category = useMemo(
    () => FEED_CATEGORIES.find((item) => item.id === categoryId),
    [categoryId],
  );

  const [activeTab, setActiveTab] = useState<CategoryTab>("posts");

  const {
    posts: feedPosts,
    isLoading,
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

  const filteredPosts = useMemo(() => {
    if (activeTab === "photo") return posts.filter((p) => p.type === "image");
    if (activeTab === "video") return posts.filter((p) => p.type === "video");
    return posts;
  }, [posts, activeTab]);

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

  const handleStartQuiz = useCallback(() => {
    router.push(ROUTES.ARENA.QUIZ);
  }, []);

  const renderPostItem = useCallback(
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

  const renderQuizItem = useCallback(
    ({ item }: ListRenderItemInfo<ArenaQuiz>) => (
      <ArenaQuizCard quiz={item} onStart={handleStartQuiz} />
    ),
    [handleStartQuiz],
  );

  if (!category) {
    return (
      <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">
            {t("category.not_found")}
          </Text>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  const categoryHeader = (
    <VStack>
      <Box className="h-48 w-full bg-muted">
        <Image
          source={{ uri: category.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={200}
          alt={t("feed.category_thumbnail_alt", {
            category: t(category.labelKey),
          })}
        />
        <Box className="absolute inset-0 bg-black/30" />
        <VStack className="absolute bottom-4 left-4">
          <Heading size="2xl" className="text-white">
            {t(category.labelKey)}
          </Heading>
        </VStack>
      </Box>

      <Tabs
        value={activeTab}
        onValueChange={(value: CategoryTab) => setActiveTab(value)}
        variant="filled"
        orientation="horizontal"
        className="px-4 py-3"
      >
        <TabsList className="rounded-full">
          {CATEGORY_TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="flex-1 rounded-full">
              <TabsTriggerText className="data-[selected=true]:text-white">
                {t(`category.tab_${tab}`)}
              </TabsTriggerText>
            </TabsTrigger>
          ))}
          <TabsIndicator className="rounded-full bg-theme" />
        </TabsList>
      </Tabs>
    </VStack>
  );

  return (
    <>
      <KeyboardAvoidingScrollView
        variant="list"
        showBackButton
        alwaysShowBar
        title={t(category.labelKey)}
      >
        {({ scrollProps, topInset }) =>
          activeTab === "quizzes" ? (
            <FlashList
              data={MOCK_ARENA_QUIZZES}
              keyExtractor={(item) => item.id}
              renderItem={renderQuizItem}
              {...scrollProps}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: topInset,
                paddingBottom: 160,
              }}
              ListHeaderComponent={categoryHeader}
              ItemSeparatorComponent={() => <Box className="h-3" />}
              ListEmptyComponent={
                <EmptyState
                  icon={HelpCircle}
                  title={t("arena.empty_title")}
                  description={t("arena.quizzes_empty")}
                  fullScreen={false}
                />
              }
            />
          ) : (
            <FlashList
              data={filteredPosts}
              keyExtractor={(item: FeedPostItem) => String(item.id)}
              renderItem={renderPostItem}
              {...scrollProps}
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={handleViewableItemsChanged}
              drawDistance={800}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: topInset,
                paddingBottom: 160,
              }}
              ListHeaderComponent={categoryHeader}
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
              // refreshing={isRefetching}
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
          )
        }
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

export default CategoryScreen;
