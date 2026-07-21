import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Flame, SearchIcon, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { FlashList } from "@shopify/flash-list";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useFollowUser, useSearchProfiles } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";

import {
  MOCK_SEARCH_PROFILES,
  MOCK_TRENDING_TOPICS,
} from "@/constants/mock-data";
import { formatCompactNumber } from "@/utils/formatNumber";

import { EmptyState } from "@/components/custom/feed/EmptyState";
import SuggestedProfileCard, {
  SuggestedProfileCardSkeleton,
} from "@/components/custom/profile/SuggestedProfileCard";

const SEARCH_DEBOUNCE_MS = 300;
const RESULTS_ROW_HEIGHT = 190;
const EMPTY_DATA: never[] = [];

const SearchScreen = () => {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((state) => state.user?.profileId);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [suggestedProfiles, setSuggestedProfiles] =
    useState<NetworkProfileItem[]>(MOCK_SEARCH_PROFILES);
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
      <SuggestedProfileCard
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

  const exploreBody = !debouncedQuery.trim() ? (
    <VStack space="lg">
      <Card className="gap-3 rounded-none shadow-none border-0">
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

      <Card className="gap-3 px-0 rounded-none shadow-none border-0">
        <HStack space="xs" className="items-center px-4">
          <Icon as={Users} size="sm" className="text-theme" />
          <Heading size="sm" className="font-baloo-bold text-foreground">
            {t("search.suggested_for_you")}
          </Heading>
        </HStack>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          paddingHorizontal={16}
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
  ) : isLoading ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3 px-4 pt-4"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <SuggestedProfileCardSkeleton key={index} />
      ))}
    </ScrollView>
  ) : results.length === 0 ? (
    <EmptyState
      icon={SearchIcon}
      title={t("search.no_results")}
      description={t("search.no_results_sub", { query: debouncedQuery })}
    />
  ) : (
    <VStack>
      <Text size="xs" className="px-4 pb-2 pt-3 text-muted-foreground">
        {t("search.results_count", { count: results.length })}
      </Text>
      <FlashList
        horizontal
        style={{ height: RESULTS_ROW_HEIGHT }}
        data={results}
        renderItem={renderItem}
        keyExtractor={(item: NetworkProfileItem) => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        ItemSeparatorComponent={() => <Box className="w-3" />}
        ListFooterComponent={
          isFetchingNextPage ? <SuggestedProfileCardSkeleton /> : null
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />
    </VStack>
  );

  return (
    <KeyboardAvoidingScrollView
      variant="list"
      showBackButton
      showSearch
      alwaysShowBar
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder={t("search.placeholder")}
      searchAutoFocus
    >
      {({ scrollProps, topInset }) => (
        <FlashList
          data={EMPTY_DATA}
          keyExtractor={() => "explore-body"}
          renderItem={() => null}
          {...scrollProps}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: topInset, paddingBottom: 24 }}
          ListHeaderComponent={exploreBody}
        />
      )}
    </KeyboardAvoidingScrollView>
  );
};

export default SearchScreen;
