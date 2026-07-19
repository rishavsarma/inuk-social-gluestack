import React, { useCallback, useEffect, useMemo, useState } from "react";

import { ArrowLeftIcon, Flame, SearchIcon, Users, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { View } from "react-native";

import { FlashList } from "@shopify/flash-list";

import { Button, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useAppTopInset } from "@/hooks/useAppInsets";
import { useFollowUser, useSearchProfiles } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";

import { MOCK_SEARCH_PROFILES, MOCK_TRENDING_TOPICS } from "@/constants/mock-data";
import { formatCompactNumber } from "@/utils/formatNumber";

import { EmptyState } from "@/components/custom/feed/EmptyState";
import ProfileListItem, {
  ProfileListItemSkeleton,
} from "@/components/custom/profile/ProfileListItem";
import SuggestedProfileCard from "@/components/custom/profile/SuggestedProfileCard";

const SEARCH_DEBOUNCE_MS = 300;

const SearchScreen = () => {
  const { t } = useTranslation();
  const topInset = useAppTopInset();
  const currentUserId = useAuthStore((state) => state.user?.profileId);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [suggestedProfiles, setSuggestedProfiles] = useState<
    NetworkProfileItem[]
  >(MOCK_SEARCH_PROFILES);
  const handleToggleSuggestedFollow = useCallback(
    (profile: NetworkProfileItem) => {
      setSuggestedProfiles((prev) =>
        prev.map((item) =>
          item.id === profile.id
            ? { ...item, isFollowing: !item.isFollowing }
            : item,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedQuery(query),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [query]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = useSearchProfiles(debouncedQuery);

  const results = useMemo(
    () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [data],
  );

  const {
    mutate: toggleFollow,
    variables: followVariables,
    isPending: isFollowPending,
  } = useFollowUser();

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
    if (!debouncedQuery.trim()) {
      return (
        <VStack space="lg" className="px-4 pt-2">
          <Card className="gap-3 rounded-2xl">
            <HStack space="xs" className="items-center">
              <Icon as={Flame} size="sm" className="text-theme" />
              <Heading size="sm" className="font-baloo-bold text-foreground">
                {t("search.trending_searches")}
              </Heading>
            </HStack>
            <HStack space="sm" className="flex-row flex-wrap">
              {MOCK_TRENDING_TOPICS.map((topic, index) => (
                <Pressable
                  key={topic.id}
                  onPress={() => setQuery(topic.tag)}
                  accessibilityRole="button"
                  accessibilityLabel={topic.tag}
                  className="w-[48%] gap-1 rounded-xl border border-border bg-input/10 p-3 active:opacity-70"
                >
                  <HStack className="items-center justify-between">
                    <Text className="font-baloo-bold text-xs text-theme">
                      #{index + 1}
                    </Text>
                    <Icon as={Flame} size="xs" className="text-theme/50" />
                  </HStack>
                  <Text
                    numberOfLines={1}
                    className="font-baloo-bold text-sm text-foreground"
                  >
                    #{topic.tag}
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    {t("search.trending_posts_count", {
                      count: formatCompactNumber(topic.postsCount),
                    })}
                  </Text>
                </Pressable>
              ))}
            </HStack>
          </Card>

          <Card className="gap-3 rounded-2xl">
            <HStack space="xs" className="items-center">
              <Icon as={Users} size="sm" className="text-theme" />
              <Heading size="sm" className="font-baloo-bold text-foreground">
                {t("search.suggested_for_you")}
              </Heading>
            </HStack>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3 pb-1"
            >
              {suggestedProfiles.map((profile) => (
                <SuggestedProfileCard
                  key={profile.id}
                  profile={profile}
                  isSelf={profile.id === currentUserId}
                  onToggleFollow={handleToggleSuggestedFollow}
                />
              ))}
            </ScrollView>
          </Card>
        </VStack>
      );
    }
    if (isLoading) {
      return (
        <VStack>
          {Array.from({ length: 6 }).map((_, index) => (
            <ProfileListItemSkeleton key={index} />
          ))}
        </VStack>
      );
    }
    return (
      <EmptyState
        icon={SearchIcon}
        title={t("search.no_results")}
        description={t("search.no_results_sub", { query: debouncedQuery })}
        fullScreen={false}
      />
    );
  }, [
    debouncedQuery,
    isLoading,
    t,
    currentUserId,
    suggestedProfiles,
    handleToggleSuggestedFollow,
  ]);

  return (
    <View className="flex-1 bg-background">
      <HStack
        space="sm"
        style={{ paddingTop: Math.max(topInset, 12) }}
        className="items-center border-b border-black/8 bg-background px-3 pb-3 dark:border-white/8"
      >
        <Button
          variant="secondary"
          size="icon"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("common.go_back")}
          className="h-10 w-10 rounded-full opacity-90"
        >
          <ButtonIcon as={ArrowLeftIcon} size="lg" />
        </Button>
        <Input className="flex-1 rounded-full border-transparent bg-muted/40 dark:bg-input/30">
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} className="text-muted-foreground" />
          </InputSlot>
          <InputField
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder={t("search.placeholder")}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel={t("search.placeholder")}
            className="text-base"
          />
          {query.length > 0 ? (
            <InputSlot
              onPress={() => setQuery("")}
              accessibilityRole="button"
              accessibilityLabel={t("search.clear")}
              className="pr-3"
            >
              <Icon as={X} className="h-4 w-4 text-muted-foreground" />
            </InputSlot>
          ) : null}
        </Input>
      </HStack>

      <FlashList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item: NetworkProfileItem) => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        ItemSeparatorComponent={() => <Divider className="ml-16" />}
        ListHeaderComponent={
          debouncedQuery.trim() && results.length > 0 ? (
            <Text size="xs" className="px-4 pb-2 pt-1 text-muted-foreground">
              {t("search.results_count", { count: results.length })}
            </Text>
          ) : null
        }
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={
          isFetchingNextPage ? (
            <VStack className="py-4">
              <ProfileListItemSkeleton />
            </VStack>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
      />
    </View>
  );
};

export default SearchScreen;
