import { EmptyState } from "@/components/custom/Feed/EmptyState";
import { FeedCategories } from "@/components/custom/Feed/FeedCategories";
import FeedHeader from "@/components/custom/Feed/FeedHeader";
import { FeedPostVideo } from "@/components/custom/Feed/FeedPostVideo";
import { PostSkeleton } from "@/components/custom/Feed/PostSkeleton";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
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
  Share2,
} from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, Share, StyleSheet, View } from "react-native";

const FeedScreen = () => {
  const { t } = useTranslation();
  const { theme } = useSettingStore();
  const isDark = theme === "dark";

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
  const posts = useMemo(() => feedPosts, [feedPosts]);

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
              <HStack space="lg" className="justify-between px-4">
                <HStack space="sm" className="flex-1 items-center ">
                  <Avatar className="h-10 w-10">
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
                  size="default"
                  variant="ghost"
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
    [isDark, t, likeMutation],
  );

  return (
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
          progressViewOffset={topInset + 20}
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
  );
};

export default FeedScreen;
