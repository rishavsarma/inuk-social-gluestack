import React, { useCallback, useEffect, useMemo, useState } from "react";

import { ArrowLeftIcon, SearchIcon, UserSearch, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { View } from "react-native";

import { FlashList } from "@shopify/flash-list";

import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

import { useAppTopInset } from "@/hooks/useAppInsets";
import { useAuthStore } from "@/stores/auth.store";

import { MOCK_SEARCH_PROFILES } from "@/constants/mock-data";

import { EmptyState } from "@/components/custom/Feed/EmptyState";
import ProfileListItem from "@/components/custom/Profile/ProfileListItem";

const SEARCH_DEBOUNCE_MS = 300;

function SearchScreen() {
  const { t } = useTranslation();
  const topInset = useAppTopInset();
  const currentUserId = useAuthStore((state) => state.user?.profileId);

  const [profiles, setProfiles] = useState<NetworkProfileItem[]>(
    MOCK_SEARCH_PROFILES,
  );
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedQuery(query),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [query]);

  const results = useMemo(() => {
    const trimmed = debouncedQuery.trim().toLowerCase();
    if (!trimmed) return [];
    return profiles.filter((profile) => {
      const fullName = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.toLowerCase();
      return (
        fullName.includes(trimmed) ||
        (profile.username ?? "").toLowerCase().includes(trimmed)
      );
    });
  }, [profiles, debouncedQuery]);

  const handleToggleFollow = useCallback((profile: NetworkProfileItem) => {
    setProfiles((prev) =>
      prev.map((item) =>
        item.id === profile.id
          ? { ...item, isFollowing: !item.isFollowing }
          : item,
      ),
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: NetworkProfileItem }) => (
      <ProfileListItem
        profile={item}
        isSelf={item.id === currentUserId}
        onToggleFollow={handleToggleFollow}
      />
    ),
    [currentUserId, handleToggleFollow],
  );

  const listEmptyComponent = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return (
        <EmptyState
          icon={UserSearch}
          title={t("search.start_typing")}
          description={t("search.start_typing_sub")}
          fullScreen={false}
        />
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
  }, [debouncedQuery, t]);

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <HStack
        space="sm"
        style={{ paddingTop: Math.max(topInset, 12) }}
        className="items-center border-b border-border/60 bg-background px-3 pb-3"
      >
        <Button
          variant="secondary"
          size="icon"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("common.go_back")}
          className="h-10 w-10 rounded-full"
        >
          <ButtonIcon as={ArrowLeftIcon} />
        </Button>
        <Input className="flex-1 rounded-full">
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
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
        refreshing={false}
        onRefresh={() => {}}
        ListEmptyComponent={listEmptyComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
      />
    </View>
  );
}

export default SearchScreen;
