import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import ListHeader, {
  SwipeableTabContent,
} from "@/components/custom/Profile/ProfileHeaderCard";
import { ProfileEmptyState } from "@/components/custom/Profile/ProfileEmptyState";
import ProfileHeaderSkeleton from "@/components/custom/Profile/ProfileHeaderSkeleton";
import ProfileGridItem from "@/components/custom/Profile/ProfilePostList";
import { useGetPhotoPosts, useGetVideoPosts } from "@/hooks/usePosts";
import { ROUTES } from "@/routes";

import { useGetProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { FlashList } from "@shopify/flash-list";
import { Href, router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { RefreshControl, useWindowDimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList as unknown as React.ComponentClass<any>,
);

const PROFILE_TABS = ["image", "video", "text"] as const;

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

  if (isLoadingProfile || !profileData) {
    return (
      <KeyboardAvoidingScrollView disableTopInset>
        <ProfileHeaderSkeleton />
      </KeyboardAvoidingScrollView>
    );
  }

  const posts =
    activeTab === "image"
      ? postsPhotoData?.pages?.[0] || []
      : activeTab === "video"
        ? postsVideoData?.pages?.[0] || []
        : [];

  const isLoadingActiveTabPosts =
    activeTab === "image"
      ? isLoadingPhotoPosts
      : activeTab === "video"
        ? isLoadingVideoPosts
        : false;

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
              <ProfileEmptyState
                isLoadingPosts={isLoadingActiveTabPosts}
                activeTab={activeTab}
                imageSize={width / 3}
              />
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
