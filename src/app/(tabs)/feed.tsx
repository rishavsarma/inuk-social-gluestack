import { FeedCategories } from "@/components/custom/Feed/FeedCategories";
import { FeedPostVideo } from "@/components/custom/Feed/FeedPostVideo";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { ThemeSwitcher } from "@/components/custom/ThemeSwitcher";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGetFeedPosts } from "@/hooks/use-posts";
import { useSettingStore } from "@/stores/setting.store";
import { formatDistanceToNow } from "date-fns";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react-native";
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
      <ThemeSwitcher />
      <FeedCategories />
      <VStack space="lg" className="pb-40">
        {feedPosts
          .filter((f) => f.type === "video")
          .map((item: any) => {
            const type = item.type;
            const avatarUrl = item.author?.avatar_url;
            const displayName =
              item.author?.display_name || item.author?.username || "User";
            const createdAt = item.created_at
              ? formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                })
              : "";
            const caption = item.caption || "";
            const mediaItem = item.media?.[0] ?? null;
            const mediaUrl = mediaItem?.url ?? null;
            const isLiked = !!item.is_liked;
            const likesCount = item.likes_count ?? 0;
            const commentsCount = item.comments_count ?? 0;

            return (
              <Card
                key={item.id}
                className="gap-3 overflow-hidden rounded-md border-0 px-0 pb-0 "
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
                      {caption.trim()} Golden hour is a photographers best
                      froend. Cauyght this shot of the beautiful @jessicabrooks
                      during a recent trip to the mountains. The warm light and
                      soft shadows create a dreamy atmosphere that perfectly
                      captures the essence of the moment. #goldenhour
                      #photography #nature
                    </Text>
                  )}
                  {!!mediaUrl && (
                    <Box className="relative h-96 w-full overflow-hidden rounded-none bg-card">
                      {type === "video" ? (
                        <FeedPostVideo id={String(item.id)} uri={mediaUrl} />
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
                            <Button
                              variant="ghost"
                              className="data-[active=true]:bg-transparent"
                            >
                              <ButtonIcon
                                as={Heart}
                                size="lg"
                                className={
                                  isLiked
                                    ? "text-theme fill-theme"
                                    : "text-foreground"
                                }
                              />
                              <ButtonText className="font-semibold">
                                {likesCount}
                              </ButtonText>
                            </Button>
                            <View className="h-4 w-px bg-foreground/20" />
                            <HStack
                              space="xs"
                              className="items-center px-3 py-2"
                            >
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
                            <Divider
                              orientation="vertical"
                              className="h-4 w-px bg-foreground/20"
                            />
                            <HStack
                              space="xs"
                              className="items-center px-3 py-2"
                            >
                              <Icon
                                as={Share2}
                                size="sm"
                                className="text-foreground"
                              />
                              <Text
                                size="sm"
                                className=" font-semibold text-foreground"
                              >
                                {commentsCount}
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
