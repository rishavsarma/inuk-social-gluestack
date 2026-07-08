import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import ListHeader, {
  SwipeableTabContent,
} from "@/components/custom/Profile/ProfileHeaderCard";
import ProfileGridItem from "@/components/custom/Profile/ProfilePostList";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useGetPhotoPosts, useGetVideoPosts } from "@/hooks/use-posts";
import { ROUTES } from "@/routes";

import { useGetProfile } from "@/hooks/use-profile";
import { useAuthStore } from "@/stores/auth.store";
import { FlashList } from "@shopify/flash-list";
import { Href, router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { RefreshControl, useWindowDimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList as unknown as React.ComponentClass<any>,
);

const PROFILE_TABS = ["image", "video", "audio", "text"] as const;

type ProfileTab = (typeof PROFILE_TABS)[number];

// ─── Profile Screen ─────────────────────────────────────────────────
const ProfileScreen = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>("image");
  const { id: userId } = useLocalSearchParams<{ id?: string }>();
  const isOtherUser = !!userId && userId !== user?.profileId;
  const profileId = userId || user?.profileId || "";
  const { width } = useWindowDimensions();

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isRefetching,
    refetch,
  } = useGetProfile(profileId);

  const {
    data: postsPhotoData,
    isLoading: isLoadingPhotoPosts,
    refetch: refetchPhotoPosts,
  } = useGetPhotoPosts(profileId, activeTab === "image");
  const {
    data: postsVideoData,
    isLoading: isLoadingVideoPosts,
    refetch: refetchVideoPosts,
  } = useGetVideoPosts(profileId, activeTab === "video");

  const renderItem = useCallback(
    ({ item }: { item: ProfileMediaItem }) => {
      const typeStr = activeTab;
      console.log("activeTab", activeTab);
      return (
        <ProfileGridItem
          key={item.id}
          item={item}
          imageSize={width / 3}
          type={typeStr}
          isDark={true}
          onPress={() => {
            router.push(
              `${ROUTES.CONTENT.POST_DETAILS(
                item.mediaId,
                item.postId,
              )}?id=${item.id}&profile_id=${
                item.profileId || item.profile_id
              }&type=${typeStr}` as Href,
            );
          }}
        />
      );
    },
    [width, activeTab],
  );
  const onRefresh = useCallback(() => {
    refetch();
    refetchPhotoPosts();
  }, [refetch, refetchPhotoPosts]);

  if (
    isLoadingProfile ||
    (activeTab === "image" && isLoadingPhotoPosts) ||
    (activeTab === "video" && isLoadingVideoPosts) ||
    !profileData
  ) {
    return null;
  }

  const posts =
    activeTab === "image"
      ? postsPhotoData?.pages?.[0] || []
      : activeTab === "video"
        ? postsVideoData?.pages?.[0] || []
        : [];

  return (
    <KeyboardAvoidingScrollView
      disableTopInset
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
      }
    >
      <SwipeableTabContent activeTab={activeTab} onTabChange={setActiveTab}>
        <Animated.View
          entering={FadeIn.duration(280)}
          style={{ flex: 1 }}
          className="bg-background pb-40"
        >
          <AnimatedFlashList
            data={posts}
            numColumns={3}
            scrollEnabled={false}
            ListHeaderComponent={
              <>
                <ListHeader
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  profile={profileData.profile}
                  stats={profileData.stats}
                  isOtherUser={isOtherUser}
                />
              </>
            }
            ListEmptyComponent={
              <Box className="w-full gap-4 p-3">
                <Skeleton variant="sharp" className="h-[100px]" />
                <SkeletonText _lines={3} className="h-2" />
                <HStack space="xs" className="align-middle">
                  <Skeleton
                    variant="circular"
                    className="h-[24px] w-[28px] mr-2"
                  />
                  <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
                </HStack>
              </Box>
            }
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            initialNumToRender={12}
            windowSize={5}
            renderItem={renderItem}
            estimatedItemSize={width / 3}
          />
        </Animated.View>
      </SwipeableTabContent>
    </KeyboardAvoidingScrollView>
  );
};

export default ProfileScreen;
