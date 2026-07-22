import { useMemo, useState, useEffect, useLayoutEffect } from "react";

import { Heart, MessageCircle, MoreHorizontal, Play, Share2, Dot } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, View, ScrollView, useWindowDimensions } from "react-native";
import { BlurView } from "expo-blur";
import { useIsFocused } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";

import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSettingStore } from "@/stores/setting.store";

import { POST_CATEGORIES, VISIBILITY_OPTIONS } from "@/constants/create-post";
import type { CreatePostMode } from "@/constants/create-post";
import { useAuthStore } from "@/stores/auth.store";
import { buildImageUrl } from "@/utils/media";

function PreviewVideoPlayer({ uri, isActive }: { uri: string; isActive: boolean }) {
  const isFocused = useIsFocused();
  const player = useVideoPlayer({ uri }, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (!isActive || !isFocused) {
      player.pause();
    }
  }, [isActive, isFocused, player]);

  useLayoutEffect(() => {
    return () => {
      try {
        player.pause();
      } catch { }
    };
  }, [player]);

  return (
    <VideoView
      style={{ width: "100%", height: "100%" }}
      player={player}
      nativeControls
      contentFit="cover"
    />
  );
}

interface CreatePreviewProps {
  mode: CreatePostMode;
  photos: string[];
  videoUri: string | null;
  videoUris?: string[];
  text: string;
  caption: string;
  categoryId: string;
  themeDotClassName: string;
  location: string;
  tags: string[];
  visibility: PostVisibility;
  onVisibilityChange: (v: PostVisibility) => void;
}

export function CreatePreview({
  mode,
  photos,
  videoUri,
  videoUris = [],
  text,
  caption,
  categoryId,
  themeDotClassName,
  location,
  tags,
  visibility,
  onVisibilityChange,
}: CreatePreviewProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { theme: settingsTheme } = useSettingStore();
  const isDark = settingsTheme === "dark";
  const { width } = useWindowDimensions();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);

  const activeVideoUris = useMemo(() => {
    return videoUris.length > 0 ? videoUris : (videoUri ? [videoUri] : []);
  }, [videoUri, videoUris]);

  const category = useMemo(
    () => POST_CATEGORIES.find((c) => c.id === categoryId) ?? POST_CATEGORIES[0],
    [categoryId],
  );

  const displayName = user?.name || t("common.user");
  const avatarUrl =
    user?.avatar && user.avatar !== "string"
      ? buildImageUrl(user.avatar, 150)
      : undefined;

  return (
    <VStack space="lg" className="pb-6">
      <Card className="gap-3 overflow-hidden rounded-none border-0 px-0 pb-0 bg-card">
        <HStack space="lg" className="justify-between items-center px-2">
          <HStack space="sm" className="flex-1 items-center">
            <Avatar className="h-12 w-12">
              <AvatarFallbackText>{displayName}</AvatarFallbackText>
              <AvatarImage
                source={{ uri: avatarUrl }}
                alt={t("profile.avatar_alt", { name: displayName })}
                className="w-full h-full"
              />
            </Avatar>
            <VStack className="">
              <Text size="md" className="py-0 font-baloo-bold">
                {displayName}
              </Text>
              <HStack space="xs" className="items-center">
                <Text size="xs" className="leading-none text-muted-foreground">
                  {location || t("create_post.preview_no_location")}
                </Text>
                <Icon as={Dot} size="sm" className="" />
                <Text size="xs" className="leading-none text-muted-foreground">
                  {t("create_post.preview_just_now")}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          <Button
            size="default"
            variant="ghost"
            accessibilityRole="button"
            accessibilityLabel={t("post_options.menu_a11y")}
            className="rounded-full p-0 data-[active=true]:bg-transparent"
          >
            <ButtonIcon as={MoreHorizontal} size="lg" />
          </Button>
        </HStack>

        {caption ? (
          <Text size="md" className="px-2 pb-1">
            {caption.trim()}
          </Text>
        ) : null}

        <Box className="relative h-96 w-full overflow-hidden rounded-none bg-card">
          <HStack
            space="xs"
            className="absolute left-2.5 top-2.5 z-10 items-center rounded-full bg-black/40 px-3 py-1"
          >
            <Box className={`h-1.5 w-1.5 rounded-full ${category.dotColorClassName}`} />
            <Text size="xs" className="font-semibold text-white">
              {t(category.labelKey)}
            </Text>
          </HStack>

          {mode === "photo" && photos.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  setPhotoIndex(
                    Math.round(e.nativeEvent.contentOffset.x / (width || 1)),
                  );
                }}
                className="h-full w-full"
              >
                {photos.map((uri) => (
                  <View key={uri} style={{ width, height: 384 }}>
                    <Image
                      source={{ uri }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </View>
                ))}
              </ScrollView>
              {photos.length > 1 ? (
                <Box className="absolute left-1/2 top-3 z-10 -translate-x-1/2 flex-row gap-1">
                  {photos.map((uri, i) => (
                    <Box
                      key={uri}
                      className={
                        i === photoIndex
                          ? "h-1.5 w-4 rounded-full bg-white"
                          : "h-1.5 w-1.5 rounded-full bg-white/50"
                      }
                    />
                  ))}
                </Box>
              ) : null}
            </>
          ) : null}

          {mode === "video" && activeVideoUris.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  setVideoIndex(
                    Math.round(e.nativeEvent.contentOffset.x / (width || 1)),
                  );
                }}
                className="h-full w-full"
              >
                {activeVideoUris.map((uri, index) => (
                  <View key={uri} style={{ width }}>
                    <PreviewVideoPlayer uri={uri} isActive={index === videoIndex} />
                  </View>
                ))}
              </ScrollView>
              {activeVideoUris.length > 1 ? (
                <Box className="absolute left-1/2 top-3 z-10 -translate-x-1/2 flex-row gap-1">
                  {activeVideoUris.map((uri, i) => (
                    <Box
                      key={uri}
                      className={
                        i === videoIndex
                          ? "h-1.5 w-4 rounded-full bg-white"
                          : "h-1.5 w-1.5 rounded-full bg-white/50"
                      }
                    />
                  ))}
                </Box>
              ) : null}
            </>
          ) : null}

          {mode === "video" && activeVideoUris.length === 0 ? (
            <Box className="h-full w-full items-center justify-center bg-black">
              <Box className="h-14 w-14 items-center justify-center rounded-full bg-white/90">
                <Icon as={Play} size="lg" className="text-black" />
              </Box>
            </Box>
          ) : null}

          {mode === "text" ? (
            <Box className="h-full w-full items-center justify-center p-8 bg-theme">
              <Text className="text-center font-baloo-bold text-xl leading-8 text-white">
                {text.trim() || t("create_post.preview_no_content")}
              </Text>
            </Box>
          ) : null}

          {mode === "photo" && photos.length === 0 ? (
            <Box className="h-full w-full items-center justify-center">
              <Text size="sm" className="text-muted-foreground">
                {t("create_post.add_photos_a11y")}
              </Text>
            </Box>
          ) : null}

          {/* <VStack className="absolute bottom-3 left-4 right-4 items-center">
            <View className="overflow-hidden rounded-full shadow-lg">
              <BlurView
                intensity={Platform.OS === "android" ? 100 : 70}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />

              <HStack className="items-center bg-white/40 px-1 dark:bg-black/30">
                <Pressable
                  onPress={() => {}}
                  hitSlop={10}
                  accessibilityRole="button"
                >
                  <HStack space="sm" className="items-center px-3 py-2">
                    <Icon as={Heart} size="sm" className="text-foreground" />
                    <Text size="sm" className="font-semibold text-foreground">
                      0
                    </Text>
                  </HStack>
                </Pressable>
                <Divider
                  orientation="vertical"
                  className="h-4 w-px bg-foreground/20"
                />
                <Pressable
                  onPress={() => {}}
                  hitSlop={8}
                  accessibilityRole="button"
                >
                  <HStack space="sm" className="items-center px-3 py-2">
                    <Icon as={MessageCircle} size="sm" className="text-foreground" />
                    <Text size="sm" className="font-semibold text-foreground">
                      0
                    </Text>
                  </HStack>
                </Pressable>
                <Divider
                  orientation="vertical"
                  className="h-4 w-px bg-foreground/20"
                />
                <Pressable
                  onPress={() => {}}
                  hitSlop={8}
                  accessibilityRole="button"
                >
                  <HStack space="sm" className="items-center px-3 py-2">
                    <Icon as={Share2} size="sm" className="text-foreground" />
                    <Text size="sm" className="font-semibold text-foreground">
                      0
                    </Text>
                  </HStack>
                </Pressable>
              </HStack>
            </View>
          </VStack> */}
        </Box>
      </Card>

      <VStack space="sm" className="px-2">
        <Text className="font-baloo-bold text-xs uppercase tracking-wider text-foreground/50 mb-1">
          {t("create_post.visibility_label")}
        </Text>
        <HStack space="sm">
          {VISIBILITY_OPTIONS.map((opt) => {
            const isSelected = opt.value === visibility;
            return (
              <Pressable
                key={opt.value}
                onPress={() => onVisibilityChange(opt.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={t(opt.labelKey)}
                className={
                  isSelected
                    ? "flex-1 items-center gap-2 rounded-xl border border-theme bg-theme/10 px-2 py-4"
                    : "flex-1 items-center gap-2 rounded-xl border border-border bg-card/70 px-2 py-4"
                }
              >
                <Icon
                  as={opt.icon}
                  size="md"
                  className={isSelected ? "text-theme" : "text-muted-foreground"}
                />
                <Text
                  size="2xs"
                  className={
                    isSelected
                      ? "font-baloo-bold text-theme"
                      : "font-baloo-semibold text-muted-foreground"
                  }
                >
                  {t(opt.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </HStack>
      </VStack>
    </VStack>
  );
}
