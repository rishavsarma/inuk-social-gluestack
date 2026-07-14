import { useCallback, useMemo, useState } from "react";

import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { CompassIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import { EmptyState } from "@/components/custom/Feed/EmptyState";
import DiscoverCreatorCard from "@/components/custom/Discover/DiscoverCreatorCard";
import DiscoverPostTile from "@/components/custom/Discover/DiscoverPostTile";
import type { KeyboardAvoidingListScrollProps } from "@/components/custom/KeyboardAvoidingScrollView";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";

import {
  MOCK_DISCOVER_POSTS,
  MOCK_SEARCH_PROFILES,
  MOCK_TRENDING_TOPICS,
} from "@/constants/mock-data";

interface DiscoverTrendingTabProps {
  onPostPress: () => void;
  topInset: number;
  scrollProps: KeyboardAvoidingListScrollProps;
  headerContent: React.ReactNode;
}

function DiscoverTrendingTab({
  onPostPress,
  topInset,
  scrollProps,
  headerContent,
}: DiscoverTrendingTabProps) {
  const { t } = useTranslation();

  const [creators, setCreators] = useState<NetworkProfileItem[]>(
    MOCK_SEARCH_PROFILES,
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  const handleToggleFollow = useCallback((profile: NetworkProfileItem) => {
    setCreators((prev) =>
      prev.map((item) =>
        item.id === profile.id
          ? { ...item, isFollowing: !item.isFollowing }
          : item,
      ),
    );
  }, []);

  const renderPostTile = useCallback(
    ({ item }: ListRenderItemInfo<DiscoverPost>) => (
      <Box className="flex-1 p-1">
        <DiscoverPostTile post={item} onPress={onPostPress} />
      </Box>
    ),
    [onPostPress],
  );

  const listHeader = useMemo(
    () => (
      <VStack space="lg" className="pb-2">
        {headerContent}
        <VStack space="sm">
          <Heading size="sm" className="px-4 text-foreground">
            {t("discover.creators_to_follow")}
          </Heading>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
          >
            {creators.map((profile) => (
              <DiscoverCreatorCard
                key={profile.id}
                profile={profile}
                onToggleFollow={handleToggleFollow}
              />
            ))}
          </ScrollView>
        </VStack>

        <VStack space="sm">
          <Heading size="sm" className="px-4 text-foreground">
            {t("discover.trending_topics")}
          </Heading>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
          >
            {MOCK_TRENDING_TOPICS.map((topic) => (
              <Badge
                key={topic.id}
                variant="outline"
                className="rounded-full px-3 py-1.5"
              >
                <BadgeText className="normal-case">#{topic.tag}</BadgeText>
              </Badge>
            ))}
          </ScrollView>
        </VStack>

        <Heading size="sm" className="px-4 text-foreground">
          {t("discover.trending_posts")}
        </Heading>
      </VStack>
    ),
    [creators, handleToggleFollow, headerContent, t],
  );

  return (
    <FlashList
      data={MOCK_DISCOVER_POSTS}
      keyExtractor={(item) => item.id}
      renderItem={renderPostTile}
      numColumns={2}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      {...scrollProps}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: topInset,
        paddingHorizontal: 12,
        paddingBottom: 160,
      }}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={
        <EmptyState
          icon={CompassIcon}
          title={t("discover.empty_title")}
          description={t("discover.empty_description")}
          fullScreen={false}
        />
      }
    />
  );
}

export default DiscoverTrendingTab;
