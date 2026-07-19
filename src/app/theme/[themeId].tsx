import { useCallback, useMemo, useState } from "react";

import { router, useLocalSearchParams, type Href } from "expo-router";

import { useWindowDimensions } from "react-native";

import { Image } from "expo-image";
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

import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { useFeedPostsList } from "@/hooks/usePosts";

import ArenaQuizCard from "@/components/custom/arena/ArenaQuizCard";
import { EmptyState } from "@/components/custom/feed/EmptyState";
import { PostSkeleton } from "@/components/custom/feed/PostSkeleton";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import ProfileGridItem from "@/components/custom/profile/ProfilePostList";
import { ThemeChipRow } from "@/components/custom/theme/ThemeChipRow";

import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { LinearGradient } from "@/components/ui/linear-gradient";
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

import { FEED_CATEGORIES, MOCK_ARENA_QUIZZES } from "@/constants/mock-data";
import { POST_CATEGORIES } from "@/constants/create-post";
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

  const theme = useMemo(
    () => FEED_CATEGORIES.find((item) => item.id === themeId),
    [themeId],
  );

  const [activeTab, setActiveTab] = useState<ThemeTab>("post");
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(
    themeId,
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null,
  );

  const category = useMemo(
    () => POST_CATEGORIES.find((item) => item.id === activeCategoryId),
    [activeCategoryId],
  );

  const categoryOptions = useMemo(
    () =>
      POST_CATEGORIES.map((option) => ({
        id: option.id,
        labelKey: option.labelKey,
        accentClassName: option.dotColorClassName,
      })),
    [],
  );

  const subcategoryOptions = useMemo(
    () =>
      category?.subcategoryLabelKeys.map((key) => ({
        id: key,
        labelKey: key,
        accentClassName: category.dotColorClassName,
      })) ?? [],
    [category],
  );

  const handleCategorySelect = useCallback((id: string | null) => {
    if (!id) return;
    setActiveCategoryId(id);
    setActiveSubcategory(null);
  }, []);

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

    if (activeSubcategory) {
      const keyword = activeSubcategory.split(".").pop()?.toLowerCase();
      result = result.filter((post: FeedPostItem) =>
        post.tags?.some((tag) => tag.toLowerCase() === keyword),
      );
    }
    return result;
  }, [feedPosts, activeTab, activeSubcategory]);

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

  if (!theme) {
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
      {/* <Box className="relative h-56 w-full overflow-hidden bg-muted">
        <Image
          source={{ uri: theme.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={200}
          alt={t("feed.category_thumbnail_alt", {
            category: t(theme.labelKey),
          })}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.05)", "rgba(0,0,0,0.85)"]}
          locations={[0, 0.45, 1]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        />

        <VStack className="absolute bottom-4 left-4 right-4">
          <Heading
            size="2xl"
            numberOfLines={2}
            className="font-baloo-extrabold text-white"
          >
            {t(theme.labelKey)}
          </Heading>
        </VStack>
      </Box> */}

      <VStack space="md" className="pt-4">
        <ThemeChipRow
          label={t("theme.category_label")}
          options={categoryOptions}
          selectedId={activeCategoryId ?? null}
          onSelect={handleCategorySelect}
          getLabel={t}
          showDot
        />

        {subcategoryOptions.length > 0 && (
          <ThemeChipRow
            label={t("theme.subcategory_label")}
            options={subcategoryOptions}
            selectedId={activeSubcategory}
            onSelect={setActiveSubcategory}
            getLabel={t}
            clearLabel={t("theme.all_subcategories")}
          />
        )}
      </VStack>

      <Divider className="mx-4 mt-4" />

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
    <KeyboardAvoidingScrollView
      variant="list"
      showBackButton
      alwaysShowBar
      title={t(theme.labelKey)}
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
  );
};

export default ThemeScreen;
