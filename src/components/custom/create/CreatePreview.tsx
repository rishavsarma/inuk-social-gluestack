import { useMemo } from "react";

import { Heart, MessageCircle, MoreHorizontal, Play, Share2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";

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

interface CreatePreviewProps {
  mode: CreatePostMode;
  photos: string[];
  videoUri: string | null;
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

  const category = useMemo(
    () => POST_CATEGORIES.find((c) => c.id === categoryId) ?? POST_CATEGORIES[0],
    [categoryId],
  );

  const displayName = user?.name || user?.username || t("common.user");
  const avatarUrl =
    user?.avatar && user.avatar !== "string"
      ? `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${user.avatar}/jpeg/150`
      : undefined;

  return (
    <VStack space="lg" className="pb-6">
      <Card className="gap-3 overflow-hidden rounded-md border-0 px-0 pb-0 bg-card">
        <HStack space="lg" className="justify-between items-center px-4">
          <HStack space="sm" className="flex-1 items-center">
            <Avatar className="h-12 w-12">
              <AvatarFallbackText>{displayName}</AvatarFallbackText>
              <AvatarImage
                source={{ uri: avatarUrl }}
                alt={t("profile.avatar_alt", { name: displayName })}
                className="w-full h-full"
              />
            </Avatar>
            <VStack>
              <Text
                size="md"
                bold
                className="leading-none py-0 leading-0 font-baloo-bold"
              >
                {displayName}
              </Text>
              <Text size="xs" className="leading-none text-muted-foreground mt-0.5">
                📍 {location || t("create_post.preview_no_location")}
              </Text>
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
          <Text size="md" className="px-4">
            {caption.trim()}
          </Text>
        ) : null}

        <Box className="relative h-96 w-full overflow-hidden rounded-none bg-muted/20">
          <HStack
            space="xs"
            className="absolute left-2.5 top-2.5 z-10 items-center rounded-full bg-black/40 px-2.5 py-1"
          >
            <Box className={`h-1.5 w-1.5 rounded-full ${category.dotColorClassName}`} />
            <Text size="xs" className="font-semibold text-white">
              {t(category.labelKey)}
            </Text>
          </HStack>

          {mode === "photo" && photos.length > 0 ? (
            <Image
              source={{ uri: photos[0] }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : null}

          {mode === "video" ? (
            <Box className="h-full w-full items-center justify-center bg-black">
              {videoUri ? (
                <Image
                  source={{ uri: videoUri }}
                  style={{ width: "100%", height: "100%", opacity: 0.6 }}
                  contentFit="cover"
                />
              ) : null}
              <Box className="absolute h-14 w-14 items-center justify-center rounded-full bg-white/90">
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

          <VStack className="absolute bottom-3 left-4 right-4 items-center">
            <View className="overflow-hidden rounded-full shadow-lg">
              <BlurView
                intensity={Platform.OS === "android" ? 100 : 70}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />

              <HStack className="items-center bg-white/40 px-1 dark:bg-black/30">
                <HStack space="sm" className="items-center px-3 py-2">
                  <Icon as={Heart} size="sm" className="text-foreground" />
                  <Text size="sm" className="font-semibold text-foreground">0</Text>
                </HStack>
                <Divider orientation="vertical" className="h-4 w-px bg-foreground/20" />
                <HStack space="sm" className="items-center px-3 py-2">
                  <Icon as={MessageCircle} size="sm" className="text-foreground" />
                  <Text size="sm" className="font-semibold text-foreground">0</Text>
                </HStack>
                <Divider orientation="vertical" className="h-4 w-px bg-foreground/20" />
                <HStack space="sm" className="items-center px-3 py-2">
                  <Icon as={Share2} size="sm" className="text-foreground" />
                  <Text size="sm" className="font-semibold text-foreground">0</Text>
                </HStack>
              </HStack>
            </View>
          </VStack>
        </Box>
      </Card>

      <VStack space="sm" className="px-1">
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
                    ? "flex-1 items-center gap-1.5 rounded-xl border border-theme bg-theme/10 px-2 py-3.5"
                    : "flex-1 items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-2 py-3.5"
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
