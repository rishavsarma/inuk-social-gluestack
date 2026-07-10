import { EmptyState } from "@/components/custom/Feed/EmptyState";
import { FeedCategories } from "@/components/custom/Feed/FeedCategories";
import FeedHeader from "@/components/custom/Feed/FeedHeader";
import { FeedPostVideo } from "@/components/custom/Feed/FeedPostVideo";
import { PostSkeleton } from "@/components/custom/Feed/PostSkeleton";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { PostOptionsActionsheet } from "@/components/custom/Post/PostOptionsActionsheet";
import { ThemeSwitcher } from "@/components/custom/ThemeSwitcher";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useGetFeedPosts, useLikeFeedPostMutation } from "@/hooks/usePosts";
import { ROUTES } from "@/routes";
import { useFeedVideoStore } from "@/stores/feed-video.store";
import { useSettingStore } from "@/stores/setting.store";
import {
  FlashList,
  type ListRenderItemInfo,
  type ViewToken,
} from "@shopify/flash-list";
import { formatDistanceToNow } from "date-fns";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Href, router } from "expo-router";
import {
  Heart,
  ImageOff,
  MessageCircle,
  MoreHorizontal,
  UserPlus,
  Share2,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, Share, StyleSheet, View } from "react-native";

const FeedScreen = () => {
  const { t } = useTranslation();
  const { theme } = useSettingStore();
  const isDark = theme === "dark";
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
  const feedPosts = useMemo(
    () => postsData?.pages?.flatMap((page: any) => page?.data ?? []) ?? [],
    [postsData],
  );

  const [hiddenPostIds, setHiddenPostIds] = useState<Set<string>>(new Set());
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [activeOptionsPost, setActiveOptionsPost] = useState<{
    postId: string;
    authorId: string | number | undefined;
  } | null>(null);

  const posts = useMemo(
    () => feedPosts.filter((post: any) => !hiddenPostIds.has(String(post.id))),
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
    ({ viewableItems }: { viewableItems: ViewToken<any>[] }) => {
      const activeVideo = viewableItems.find(
        (token) => token.isViewable && token.item?.type === "video",
      );
      setActiveVideoId(activeVideo ? String(activeVideo.item.id) : null);
    },
    [setActiveVideoId],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<any>) => {
      const type = item.type;
      const avatarUrl = item.author?.avatar_url;
      const displayName =
        item.author?.display_name || item.author?.username || t("common.user");
      const createdAt = item.created_at
        ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true })
        : "";
      const caption = item.caption || "";
      const mediaItem = item.media?.[0] ?? null;
      const mediaUrl = mediaItem?.url ?? null;
      const isLiked = !!item.is_liked;
      const likesCount = item.likes_count ?? 0;
      const commentsCount = item.comments_count ?? 0;
      const sharesCount = item.shares_count ?? 0;
      const postMediaId = mediaItem?.id;

      const handlePress = () => {
        if (!postMediaId || !item.id) return;
        router.push(
          `${ROUTES.CONTENT.POST_DETAILS(
            postMediaId,
            item.id,
          )}?id=${postMediaId}&profile_id=${item.author?.id}&type=${type}` as Href,
        );
      };

      const handleCommentPress = () => {
        if (!postMediaId || !item.id) return;
        router.push(
          `${ROUTES.CONTENT.POST_DETAILS(
            postMediaId,
            item.id,
          )}?id=${postMediaId}&profile_id=${item.author?.id}&type=${type}&comments=true` as Href,
        );
      };

      const handleLikePress = () => {
        if (!item.id) return;
        likeMutation.mutate({ postId: String(item.id), isLiked });
      };

      const handleMorePress = () => {
        if (!item.id) return;
        handleOptionsPress(String(item.id), item.author?.id);
      };

      const handleSharePress = async () => {
        try {
          await Share.share({
            message: caption || "",
            ...(mediaUrl ? { url: mediaUrl } : {}),
          });
        } catch {
          // user dismissed the share sheet — nothing to do
        }
      };

      return (
        <Card className="gap-3 overflow-hidden rounded-md border-0 px-0 pb-0 ">
          <Pressable
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={t("feed.view_post_a11y")}
          >
            <VStack space="sm">
              <HStack space="lg" className="justify-between items-center px-4">
                <HStack space="sm" className="flex-1 items-center ">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      source={{ uri: avatarUrl }}
                      alt="avatar"
                      className=""
                    />
                  </Avatar>
                  <VStack space="2xs" className="flex-1 ">
                    <Text size="md" bold className="leading-none">
                      {displayName}
                    </Text>
                    <Text
                      size="sm"
                      className="text-sm leading-none text-muted-foreground"
                    >
                      {createdAt}
                    </Text>
                  </VStack>
                </HStack>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={handleMorePress}
                  accessibilityRole="button"
                  accessibilityLabel={t("post_options.menu_a11y")}
                  className="border border-border/40"
                >
                  {/* <ButtonIcon as={UserPlus} className="" /> */}
                  <ButtonText className="">Follow</ButtonText>
                </Button>
                <Button
                  size="default"
                  variant="ghost"
                  onPress={handleMorePress}
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
                  {type === "video" ? (
                    <FeedPostVideo
                      id={String(item.id)}
                      uri={mediaUrl}
                      posterUri={mediaItem?.thumbnail_url}
                    />
                  ) : (
                    <Image
                      source={{ uri: mediaUrl }}
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
                          onPress={handleLikePress}
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
                          onPress={handleCommentPress}
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
                          onPress={handleSharePress}
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
    },
    [isDark, t, likeMutation, handleOptionsPress],
  );

  return (
    <>
      <KeyboardAvoidingScrollView variant="list">
        {({ scrollProps, topInset }) => (
          <FlashList
            data={posts}
            keyExtractor={(item: any) => String(item.id)}
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
