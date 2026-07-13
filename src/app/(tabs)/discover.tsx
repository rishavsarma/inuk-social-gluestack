import { useCallback, useMemo, useState } from "react";

import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { CompassIcon, SearchIcon } from "lucide-react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

import { EmptyState } from "@/components/custom/Feed/EmptyState";
import DiscoverCreatorCard from "@/components/custom/Discover/DiscoverCreatorCard";
import DiscoverPostTile from "@/components/custom/Discover/DiscoverPostTile";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import {
  MOCK_DISCOVER_POSTS,
  MOCK_SEARCH_PROFILES,
  MOCK_TRENDING_TOPICS,
} from "@/constants/mock-data";
import { ROUTES } from "@/routes";

const DiscoverScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const [creators, setCreators] = useState<NetworkProfileItem[]>(
    MOCK_SEARCH_PROFILES,
  );

  const showComingSoonToast = useCallback(() => {
    toast.show({
      placement: "bottom",
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
          <ToastDescription>{t("discover.coming_soon")}</ToastDescription>
        </Toast>
      ),
    });
  }, [t, toast]);

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
        <DiscoverPostTile post={item} onPress={showComingSoonToast} />
      </Box>
    ),
    [showComingSoonToast],
  );

  const listHeader = useMemo(
    () => (
      <VStack space="lg" className="pb-2">
        <HStack className="items-center justify-between px-4 pt-2">
          <Heading size="xl">{t("discover.title")}</Heading>
        </HStack>

        <Button
          variant="outline"
          onPress={() => router.push(ROUTES.TABS.EXPLORE)}
          accessibilityRole="button"
          accessibilityLabel={t("search.placeholder")}
          className="mx-4 justify-start gap-2 rounded-full bg-muted/50"
        >
          <ButtonIcon as={SearchIcon} className="text-muted-foreground" />
          <Text className="text-muted-foreground">
            {t("search.placeholder")}
          </Text>
        </Button>

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
    [creators, handleToggleFollow, t],
  );

  return (
    <KeyboardAvoidingScrollView variant="list">
      {({ scrollProps, topInset }) => (
        <FlashList
          data={MOCK_DISCOVER_POSTS}
          keyExtractor={(item) => item.id}
          renderItem={renderPostTile}
          numColumns={2}
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
      )}
    </KeyboardAvoidingScrollView>
  );
};

export default DiscoverScreen;
