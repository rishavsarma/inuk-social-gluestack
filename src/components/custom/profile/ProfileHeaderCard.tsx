import React, { useCallback } from "react";

import { Image } from "expo-image";
import { Href, router } from "expo-router";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerIcon,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import {
  ArrowLeftIcon,
  FileText,
  ImageIcon,
  MoreHorizontal,
  MountainIcon,
  Music,
  Pencil,
  Star,
  Video,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { useWalletStore } from "@/stores/wallet.store";

import { useAppTopInset } from "@/hooks/useAppInsets";

import { AnimatedStatNumber } from "../NumberFormatter";
import { LinearGradient } from "@/components/ui/linear-gradient";

import { formatCompactNumber } from "@/utils/formatNumber";
import { ROUTES } from "@/routes";

const PROFILE_TABS = ["image", "video", "text"] as const;

type ProfileTab = (typeof PROFILE_TABS)[number];

// ─── Swipeable wrapper — declared at module scope so React's identity
//     check never sees a "new" component type during render. ──────────
interface SwipeableTabContentProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  children: React.ReactNode;
}

export function SwipeableTabContent({
  activeTab,
  onTabChange,
  children,
}: SwipeableTabContentProps) {
  const navigate = useCallback(
    (direction: "left" | "right") => {
      const currentIndex = PROFILE_TABS.indexOf(activeTab);
      const nextIndex =
        direction === "left" ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0 || nextIndex >= PROFILE_TABS.length) return;
      onTabChange(PROFILE_TABS[nextIndex]);
    },
    [activeTab, onTabChange],
  );

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onEnd((e) => {
      "worklet";
      const isHorizontal = Math.abs(e.velocityX) > Math.abs(e.velocityY);
      if (!isHorizontal) return;

      const isFast = Math.abs(e.velocityX) > 400;
      const isFar = Math.abs(e.translationX) > 60;
      if (!isFast && !isFar) return;

      if (e.velocityX < 0) {
        runOnJS(navigate)("left");
      } else {
        runOnJS(navigate)("right");
      }
    });

  return <GestureDetector gesture={pan}>{children as any}</GestureDetector>;
}

// ─── ListHeader ───────────────────────────────────────────────────────
export interface ListHeaderProps {
  profile: ProfileResponse;
  stats: ProfileStatsResponse;
  isOtherUser: boolean;
  activeTab: ProfileTab;
  setActiveTab: (value: ProfileTab) => void;
  showBackButton?: any;
}

function ListHeader({
  profile,
  stats,
  isOtherUser,
  setActiveTab,
  activeTab,
  showBackButton,
}: ListHeaderProps) {
  const hasCoverPhoto = !!profile.coverPhoto && profile.coverPhoto !== "string";
  const hasAvatar = !!profile.avatar && profile.avatar !== "string";
  const userDetail = {
    name: profile.givenName,
    cover: hasCoverPhoto
      ? `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${profile.coverPhoto}/jpeg/720`
      : undefined,
    avatar: hasAvatar
      ? `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${profile.avatar}/jpeg/720`
      : undefined,
    username: profile.username,
    bio: profile.bio,
    post: stats.post,
    following: stats.following,
    followers: stats.follower,
  };
  const { t } = useTranslation();
  const topInset = useAppTopInset();
  const points = useWalletStore((state) => state.points);

  return (
    <VStack space="sm" className="">
      <Box className="relative h-64 w-full bg-muted ">
        {hasCoverPhoto ? (
          <Image
            source={userDetail.cover}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            alt={t("profile.cover_photo_alt", { name: userDetail.name })}
          />
        ) : (
          <LinearGradient
            colors={["rgb(192,57,42)", "rgb(97,29,21)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Box className="flex-1 items-center justify-center">
              <Icon
                as={MountainIcon}
                className="h-20 w-20 text-white/15"
                strokeWidth={1.25}
              />
            </Box>
          </LinearGradient>
        )}
        <HStack
          style={{ paddingTop: Math.max(topInset, 12) }}
          pointerEvents="box-none"
          className="absolute left-0 right-0 top-2 z-50 flex-row items-center justify-between px-4 pb-3"
        >
          {showBackButton || isOtherUser ? (
            <Button
              onPress={() => router.back()}
              variant="secondary"
              size="icon"
              accessibilityRole="button"
              accessibilityLabel={t("common.go_back")}
              className="rounded-full h-12 w-12 opacity-80 "
            >
              <Icon as={ArrowLeftIcon} className="size-5 text-primary" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              accessibilityRole="button"
              accessibilityLabel={t("profile.sparks_balance", {
                count: points,
              })}
              onPress={() => router.push(ROUTES.USER.POINTS)}
              className="rounded-full opacity-70"
            >
              <ButtonIcon
                as={Star}
                className="text-yellow-500 fill-yellow-500"
              />
              <Text className="font-semibold">
                {formatCompactNumber(points)}
              </Text>
            </Button>
          )}

          {!isOtherUser && (
            <Button
              variant="secondary"
              accessibilityRole="button"
              accessibilityLabel={t("profile.open_menu")}
              size="icon"
              onPress={() => router.push(ROUTES.USER.MENU)}
              className="rounded-full h-12 w-12 opacity-80"
            >
              <ButtonIcon size="lg" as={MoreHorizontal} />
            </Button>
          )}
        </HStack>
      </Box>

      <HStack className="">
        {/* Avatar with overlays */}
        <Button
          variant="ghost"
          onPress={() => !isOtherUser && router.push(ROUTES.USER.EDIT_PROFILE)}
          accessibilityRole="button"
          accessibilityLabel={
            isOtherUser ? t("profile.avatar") : t("profile.edit_avatar")
          }
          className="relative -mt-12 data-[active=true]:bg-transparent"
        >
          <Avatar className="h-24 w-24 border-4 border-background bg-muted">
            <AvatarFallbackText>{userDetail.name}</AvatarFallbackText>
            {userDetail.avatar && (
              <AvatarImage
                source={{ uri: userDetail.avatar }}
                className="h-full w-full"
                alt={
                  isOtherUser ? t("profile.avatar") : t("profile.edit_avatar")
                }
              />
            )}
          </Avatar>

          {!isOtherUser && (
            <Box className="absolute right-4 bottom-4 h-6 w-6 bg-theme rounded-full items-center justify-center ring-2 ring-background">
              <Icon as={Pencil} className="h-3.5 w-3.5 text-white" />
            </Box>
          )}
        </Button>

        {/* Stats */}
        <Grid
          className=" flex-1 items-center "
          _extra={{ className: "grid-cols-3" }}
        >
          <GridItem _extra={{ className: "col-span-1" }}>
            <Button
              variant="ghost"
              accessibilityRole="button"
              accessibilityLabel={t("profile.posts_count", {
                count: userDetail?.post || 0,
              })}
              // onPress={() =>
              //   router.push(`${ROUTES.USER.NETWORK}?userId=${targetId}&tab=followers` as any)
              // }
              className="items-center active:opacity-70"
            >
              <VStack className="items-center">
                <AnimatedStatNumber value={userDetail?.post || 0} />
                <ButtonText className="text-muted-foreground">
                  {t("profile.posts")}
                </ButtonText>
              </VStack>
            </Button>
          </GridItem>
          <GridItem
            // className="bg-muted p-6 rounded-md"
            _extra={{ className: "col-span-1" }}
          >
            <Button
              variant="ghost"
              accessibilityRole="button"
              accessibilityLabel={t("profile.followers_count", {
                count: userDetail?.followers || 0,
              })}
              onPress={() =>
                router.push(
                  ROUTES.USER.NETWORK(profile.id, "followers") as Href,
                )
              }
              className="items-center active:opacity-70"
            >
              <VStack className="items-center">
                <AnimatedStatNumber value={userDetail?.followers || 0} />
                <ButtonText className="text-muted-foreground">
                  {t("profile.followers")}
                </ButtonText>
              </VStack>
            </Button>
          </GridItem>
          <GridItem
            // className="bg-muted p-6 rounded-md"
            _extra={{ className: "col-span-1" }}
          >
            <Button
              onPress={() =>
                router.push(
                  ROUTES.USER.NETWORK(profile.id, "following") as Href,
                )
              }
              variant="ghost"
              accessibilityRole="button"
              accessibilityLabel={t("profile.following_count", {
                count: userDetail?.following || 0,
              })}
              className="items-center active:opacity-70"
            >
              <VStack className="items-center">
                <AnimatedStatNumber value={userDetail?.following || 0} />
                <ButtonText className="text-muted-foreground">
                  {t("profile.following")}
                </ButtonText>
              </VStack>
            </Button>
          </GridItem>
        </Grid>
      </HStack>
      <VStack space="xs" className="px-4 ">
        <HStack space="xs" className="items-center">
          <Heading size="xl" className="font-baloo-bold">
            {userDetail.name}
          </Heading>
          {userDetail.username && (
            <Badge variant="outline" className="h-6 py-0 rounded-full">
              <BadgeText className="lowercase line-clamp-1">
                @{userDetail.username}
              </BadgeText>
            </Badge>
          )}
        </HStack>
        {userDetail.bio && (
          <Text className="mt-1.5 text-[14px] leading-5 text-foreground">
            {userDetail.bio}
          </Text>
        )}
      </VStack>

      <Tabs
        value={activeTab}
        onValueChange={(val: ProfileTab) => setActiveTab(val)}
        variant="underlined"
        className=" justify-between "
        orientation="horizontal"
      >
        <TabsList className="bg-transparent rounded-none pb-0.5">
          <TabsTrigger value="image" className=" flex-1">
            <TabsTriggerIcon as={ImageIcon} className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger value="video" className="flex-1">
            <TabsTriggerIcon as={Video} className="w-6 h-6" />
          </TabsTrigger>

          <TabsTrigger value="text" className="flex-1">
            <TabsTriggerIcon as={FileText} className="w-6 h-6" />
          </TabsTrigger>
          <TabsIndicator className="border-b" />
        </TabsList>
      </Tabs>
    </VStack>
  );
}

export default ListHeader;
