import React, { useCallback, useMemo, useState } from "react";

import { UserX, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";

import { FlashList } from "@shopify/flash-list";

import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
} from "@/components/ui/tabs";
import { VStack } from "@/components/ui/vstack";

import { useFollowUser, useGetFollowers, useGetFollowing } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";

import { EmptyState } from "@/components/custom/feed/EmptyState";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import ProfileListItem, {
  ProfileListItemSkeleton,
} from "@/components/custom/profile/ProfileListItem";

type NetworkTab = "followers" | "following";

const NetworkScreen = () => {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ userId?: string; tab?: string }>();
  const currentUserId = useAuthStore((state) => state.user?.profileId);

  const profileId = params.userId || currentUserId || "";
  const isSelf = !!profileId && profileId === currentUserId;

  const [activeTab, setActiveTab] = useState<NetworkTab>(
    params.tab === "following" ? "following" : "followers",
  );

  const followers = useGetFollowers(profileId, activeTab === "followers");
  const following = useGetFollowing(profileId, activeTab === "following");
  const active = activeTab === "followers" ? followers : following;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = active;

  const results = useMemo(
    () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [data],
  );

  const { mutate: toggleFollow, variables: followVariables, isPending: isFollowPending } =
    useFollowUser();

  const handleToggleFollow = useCallback(
    (profile: NetworkProfileItem) => {
      if (!currentUserId) return;
      toggleFollow({
        followerId: currentUserId,
        followedId: profile.id,
        action: profile.isFollowing ? "UNFOLLOW" : "FOLLOW",
      });
    },
    [currentUserId, toggleFollow],
  );

  const renderItem = useCallback(
    ({ item }: { item: NetworkProfileItem }) => (
      <ProfileListItem
        profile={item}
        isSelf={item.id === currentUserId}
        isFollowLoading={
          isFollowPending && followVariables?.followedId === item.id
        }
        onToggleFollow={handleToggleFollow}
      />
    ),
    [currentUserId, handleToggleFollow, isFollowPending, followVariables],
  );

  const listEmptyComponent = useMemo(() => {
    if (isLoading) {
      return (
        <VStack>
          {Array.from({ length: 6 }).map((_, index) => (
            <ProfileListItemSkeleton key={index} />
          ))}
        </VStack>
      );
    }
    return activeTab === "followers" ? (
      <EmptyState
        icon={Users}
        title={t("network.no_followers_yet")}
        description={t("network.followers_description")}
        fullScreen={false}
      />
    ) : (
      <EmptyState
        icon={UserX}
        title={t("network.not_following_anyone")}
        description={t("network.following_description")}
        fullScreen={false}
      />
    );
  }, [isLoading, activeTab, t]);

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={isSelf ? t("network.title_my") : t("network.title_user")}
      variant="list"
    >
      {({ scrollProps, topInset }) => (
        <FlashList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item: NetworkProfileItem) => item.id}
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <VStack className="px-4 pb-2">
              <Tabs
                value={activeTab}
                onValueChange={(value: NetworkTab) => setActiveTab(value)}
                variant="underlined"
                orientation="horizontal"
              >
                <TabsList className="bg-transparent rounded-none pb-0.5">
                  <TabsTrigger value="followers" className="flex-1">
                    <TabsTriggerText>{t("network.followers")}</TabsTriggerText>
                  </TabsTrigger>
                  <TabsTrigger value="following" className="flex-1">
                    <TabsTriggerText>{t("network.following")}</TabsTriggerText>
                  </TabsTrigger>
                  <TabsIndicator className="border-b" />
                </TabsList>
              </Tabs>
            </VStack>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <VStack className="py-4">
                <ProfileListItemSkeleton />
              </VStack>
            ) : null
          }
          ListEmptyComponent={listEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: topInset,
            paddingBottom: 120,
          }}
          {...scrollProps}
        />
      )}
    </KeyboardAvoidingScrollView>
  );
};

export default NetworkScreen;
