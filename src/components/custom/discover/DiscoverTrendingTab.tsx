import { useCallback, useMemo, useState } from "react";

import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { CompassIcon, FlameIcon, ImageIcon, UserPlusIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import { EmptyState } from "@/components/custom/feed/EmptyState";
import DiscoverCreatorCard from "@/components/custom/discover/DiscoverCreatorCard";
import DiscoverPostTile from "@/components/custom/discover/DiscoverPostTile";
import type { KeyboardAvoidingListScrollProps } from "@/components/custom/KeyboardAvoidingScrollView";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
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
          <HStack space="xs" className="items-center px-4">
            <Icon as={UserPlusIcon} size="sm" className="text-theme" />
            <Heading size="sm" className="font-baloo-bold text-foreground">
              {t("discover.creators_to_follow")}
            </Heading>
          </HStack>
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
          <HStack space="xs" className="items-center px-4">
            <Icon as={FlameIcon} size="sm" className="text-theme" />
            <Heading size="sm" className="font-baloo-bold text-foreground">
              {t("discover.trending_topics")}
            </Heading>
          </HStack>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
          >
            {MOCK_TRENDING_TOPICS.map((topic) => (
              <Badge
                key={topic.id}
                variant="outline"
                className="rounded-full border-theme/20 bg-theme/10 px-3 py-1.5"
              >
                <BadgeText className="normal-case font-semibold text-theme">
                  #{topic.tag}
                </BadgeText>
              </Badge>
            ))}
          </ScrollView>
        </VStack>

        <HStack space="xs" className="items-center px-4">
          <Icon as={ImageIcon} size="sm" className="text-theme" />
          <Heading size="sm" className="font-baloo-bold text-foreground">
            {t("discover.trending_posts")}
          </Heading>
        </HStack>
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
