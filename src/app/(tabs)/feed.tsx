import { FeedCategories } from "@/components/custom/Feed/FeedCategories";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGetFeedPosts } from "@/hooks/use-posts";
import { useSettingStore } from "@/stores/setting.store";
import { formatDistanceToNow } from "date-fns";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

const FeedScreen = () => {
  const { t } = useTranslation();
  const { theme } = useSettingStore();
  const isDark = theme === "dark";
  const {
    data: postsData,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetFeedPosts();

  const feedPosts = useMemo(
    () => postsData?.pages?.flatMap((page: any) => page?.data ?? []) ?? [],
    [postsData],
  );

  return (
    <KeyboardAvoidingScrollView className="bg-background">
      <VStack space="lg" className="pb-40">
        <FeedCategories />
        {feedPosts.map((item: any) => {
          const avatarUrl = item.author?.avatar_url;
          const displayName =
            item.author?.display_name || item.author?.username || "User";
          const createdAt = item.created_at
            ? formatDistanceToNow(new Date(item.created_at), {
                addSuffix: true,
              })
            : "";
          const caption = item.caption || "";
          const mediaUrl = item.media?.[0]?.url ?? null;
          const isLiked = !!item.is_liked;
          const likesCount = item.likes_count ?? 0;
          const commentsCount = item.comments_count ?? 0;

          return (
            <Card
              key={item.id}
              className="mx-3 gap-3 overflow-hidden rounded-3xl border-0 px-0 pb-4 shadow-sm"
            >
              <VStack space="md">
                <HStack space="lg" className="justify-between px-4">
                  <HStack space="sm" className="flex-1 items-center">
                    <Avatar>
                      <AvatarImage
                        source={{ uri: avatarUrl }}
                        alt="avatar"
                        className=""
                      />
                    </Avatar>
                    <VStack space="xs" className="flex-1 ">
                      <Text size="md" bold className="leading-none">
                        {displayName}
                      </Text>
                      <Text
                        size="sm"
                        className="leading-none text-muted-foreground"
                      >
                        {createdAt}
                      </Text>
                    </VStack>
                  </HStack>
                  <Button
                    size="default"
                    variant="ghost"
                    className="rounded-full"
                  >
                    <ButtonIcon as={MoreHorizontal} size="lg" className="" />
                  </Button>
                </HStack>
                {caption && (
                  <Text size="lg" className="leading-6 px-4">
                    {caption}
                  </Text>
                )}
                {!!mediaUrl && (
                  <Box className="relative mx-4 h-96 overflow-hidden rounded-2xl bg-muted">
                    <Image
                      source={{ uri: mediaUrl }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={300}
                    />
                    <VStack className="absolute bottom-3 left-4 right-4 items-center">
                      <View className="overflow-hidden rounded-full shadow-lg">
                        <BlurView
                          intensity={Platform.OS === "android" ? 100 : 70}
                          tint={isDark ? "dark" : "light"}
                          style={StyleSheet.absoluteFill}
                        />
                        <HStack className="items-center bg-white/40 px-1 dark:bg-black/30">
                          <HStack space="xs" className="items-center px-3 py-2">
                            <Icon
                              as={Heart}
                              size="sm"
                              className={
                                isLiked
                                  ? "text-red-500 fill-red-500"
                                  : "text-foreground"
                              }
                            />
                            <Text className="text-[13px] font-semibold text-foreground">
                              {likesCount}
                            </Text>
                          </HStack>
                          <View className="h-4 w-px bg-foreground/20" />
                          <HStack space="xs" className="items-center px-3 py-2">
                            <Icon
                              as={MessageCircle}
                              size="sm"
                              className="text-foreground"
                            />
                            <Text className="text-[13px] font-semibold text-foreground">
                              {commentsCount}
                            </Text>
                          </HStack>
                          <View className="h-4 w-px bg-foreground/20" />
                          <HStack space="xs" className="items-center px-3 py-2">
                            <Icon
                              as={Share2}
                              size="sm"
                              className="text-foreground"
                            />
                            <Text className="text-[13px] font-semibold text-foreground">
                              {t("feed.share")}
                            </Text>
                          </HStack>
                        </HStack>
                      </View>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Card>
          );
        })}
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default FeedScreen;
