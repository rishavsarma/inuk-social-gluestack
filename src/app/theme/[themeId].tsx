import { useCallback, useMemo, useState } from "react";

import { router, useLocalSearchParams, type Href } from "expo-router";

import { useWindowDimensions } from "react-native";

import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import {
  FileText,
  HelpCircle,
  Image as ImageIcon,
  ImageOff,
  LayoutGrid,
  type LucideIcon,
  Video,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { useAppTopInset } from "@/hooks/useAppInsets";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { useFeedPostsList } from "@/hooks/usePosts";

import ArenaQuizCard from "@/components/custom/arena/ArenaQuizCard";
import { CategoryBannerHeader } from "@/components/custom/discover/CategoryBannerHeader";
import { CategorySubcategoryList } from "@/components/custom/discover/CategorySubcategoryList";
import PlaceHubModal from "@/components/custom/discover/PlaceHubModal";
import { EmptyState } from "@/components/custom/feed/EmptyState";
import { PostSkeleton } from "@/components/custom/feed/PostSkeleton";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import ProfileGridItem from "@/components/custom/profile/ProfilePostList";
import { getHeaderBarHeight } from "@/components/custom/UiHeader";

import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Spinner } from "@/components/ui/spinner";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerIcon,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { MOCK_ARENA_QUIZZES } from "@/constants/mock-data";
import {
  CAT_BY_TITLE,
  THEME_ID_TO_TAXONOMY_TITLE,
} from "@/constants/discover-web-data";
import { ROUTES } from "@/routes";

type ThemeTab = "post" | "photo" | "video" | "article" | "quizzes";
const THEME_TABS: ThemeTab[] = ["post", "photo", "video", "article", "quizzes"];

const THEME_TAB_ICONS: Record<ThemeTab, LucideIcon> = {
  post: LayoutGrid,
  photo: ImageIcon,
  video: Video,
  article: FileText,
  quizzes: HelpCircle,
};

const ThemeScreen = () => {
  const { t } = useTranslation();
  const { themeId } = useLocalSearchParams<{ themeId: string }>();
  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();
  const safeAreaTopInset = useAppTopInset();
  const headerBarHeight = getHeaderBarHeight(safeAreaTopInset);

  const taxonomyCategory = useMemo(() => {
    const title = themeId ? THEME_ID_TO_TAXONOMY_TITLE[themeId] : undefined;
    return title ? CAT_BY_TITLE[title] : undefined;
  }, [themeId]);

  const [activeTab, setActiveTab] = useState<ThemeTab>("post");
  const [activeSubTitle, setActiveSubTitle] = useState<string | null>(null);
  const [subject, setSubject] = useState<DiscoverSubject | null>(null);

  const openEntity = useCallback(
    (name: string, cat: TaxonomyCategory, sub: string) => {
      setSubject({
        name,
        breadcrumb: `${cat.displayTitle} · ${sub}`,
        colour: cat.colour,
        onColour: cat.onColour,
        background: cat.background,
        text: cat.text,
        icon: cat.icon,
        theme: cat.theme,
      });
    },
    [],
  );

  const {
    posts: feedPosts,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFeedPostsList();

  const filteredPosts = useMemo(() => {
    let result = feedPosts;
    if (activeTab === "photo") {
      result = result.filter((post: FeedPostItem) => post.type === "image");
    } else if (activeTab === "video") {
      result = result.filter((post: FeedPostItem) => post.type === "video");
    } else if (activeTab === "article") {
      result = result.filter((post: FeedPostItem) => post.type === "article");
    }

    if (activeSubTitle) {
      const keyword = activeSubTitle.toLowerCase();
      result = result.filter((post: FeedPostItem) =>
        post.tags?.some((tag) => keyword.includes(tag.toLowerCase())),
      );
    }
    return result;
  }, [feedPosts, activeTab, activeSubTitle]);

  const handlePostPress = useCallback((post: FeedPostItem) => {
    const postMediaId = post.media?.[0]?.id;
    if (!postMediaId || !post.id) return;
    router.push(
      `${ROUTES.CONTENT.POST_DETAILS(
        postMediaId,
        String(post.id),
      )}?id=${postMediaId}&profile_id=${post.author?.id}&type=${post.type}` as Href,
    );
  }, []);

  const handleStartQuiz = useCallback(() => {
    router.push(ROUTES.ARENA.QUIZ);
  }, []);

  const renderGridItem = useCallback(
    ({ item }: ListRenderItemInfo<FeedPostItem>) => {
      const gridItem = {
        id: item.id,
        postId: String(item.id),
        mediaId: item.media?.[0]?.id ?? "",
        profileId: item.author?.id,
        type: item.type,
        postType: item.type,
        caption: item.caption,
        media: item.media?.map((m) => ({ url: m.url, media_id: m.id })),
        thumbnailUrl: item.media?.[0]?.thumbnail_url,
      };

      return (
        <ProfileGridItem
          item={gridItem}
          imageSize={width / 3}
          type={item.type}
          isDark={isDark}
          onPress={() => handlePostPress(item)}
        />
      );
    },
    [width, isDark, handlePostPress],
  );

  const renderQuizItem = useCallback(
    ({ item }: ListRenderItemInfo<ArenaQuiz>) => (
      <Box className="px-4">
        <ArenaQuizCard quiz={item} onStart={handleStartQuiz} />
      </Box>
    ),
    [handleStartQuiz],
  );

  if (!taxonomyCategory) {
    return (
      <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">{t("theme.not_found")}</Text>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  const themeHeader = (
    <VStack>
      <CategoryBannerHeader
        category={taxonomyCategory}
        overlapHeaderHeight={headerBarHeight}
      />
      <Box className="py-2">
        <CategorySubcategoryList
          category={taxonomyCategory}
          onEntity={openEntity}
          onSubcategoryToggle={setActiveSubTitle}
          layout="scroll"
        />
      </Box>

      {/* <Divider className="mx-4 mt-4" /> */}

      <Tabs
        value={activeTab}
        onValueChange={(value: ThemeTab) => setActiveTab(value)}
        variant="underlined"
        orientation="horizontal"
        className="px-4 pt-3"
      >
        <TabsList className="bg-transparent rounded-none">
          {THEME_TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="flex-1"
              accessibilityRole="tab"
              accessibilityLabel={t(`theme.tab_${tab}`)}
            >
              <TabsTriggerIcon as={THEME_TAB_ICONS[tab]} className="h-5 w-5" />
            </TabsTrigger>
          ))}
          <TabsIndicator className="border-b" />
        </TabsList>
      </Tabs>
    </VStack>
  );

  return (
    <>
      <KeyboardAvoidingScrollView
        variant="list"
        showBackButton
        showSearch
        alwaysShowBar
        headerBackgroundColor={
          isDark ? taxonomyCategory.colour : taxonomyCategory.background
        }
      >
        {({ scrollProps, topInset }) =>
          activeTab === "quizzes" ? (
            <FlashList
              data={MOCK_ARENA_QUIZZES}
              keyExtractor={(item) => item.id}
              renderItem={renderQuizItem}
              {...scrollProps}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: topInset,
                paddingBottom: 160,
              }}
              ListHeaderComponent={themeHeader}
              ItemSeparatorComponent={() => <Box className="h-3" />}
              ListEmptyComponent={
                <EmptyState
                  icon={HelpCircle}
                  title={t("arena.empty_title")}
                  description={t("arena.quizzes_empty")}
                  fullScreen={false}
                />
              }
            />
          ) : (
            <FlashList
              data={filteredPosts}
              extraData={filteredPosts}
              numColumns={3}
              keyExtractor={(item: FeedPostItem) => String(item.id)}
              renderItem={renderGridItem}
              {...scrollProps}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: topInset,
                paddingBottom: 160,
              }}
              ListHeaderComponent={themeHeader}
              ListEmptyComponent={
                isLoading ? (
                  <VStack space="lg" className="pt-4">
                    <PostSkeleton />
                    <PostSkeleton />
                  </VStack>
                ) : (
                  <EmptyState
                    icon={ImageOff}
                    title={t("feed.empty")}
                    description={t("feed.placeholder")}
                  />
                )
              }
              onRefresh={refetch}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <Box className="items-center py-6">
                    <Spinner />
                  </Box>
                ) : null
              }
            />
          )
        }
      </KeyboardAvoidingScrollView>
      <PlaceHubModal subject={subject} onClose={() => setSubject(null)} />
    </>
  );
};

export default ThemeScreen;
