import React, { useCallback, useState } from "react";

import {
  ArrowLeftIcon,
  FileText,
  ImageIcon,
  LogOut,
  MoreHorizontal,
  Music,
  Pencil,
  Settings,
  Sparkles,
  Star,
  User,
  Video,
  View,
} from "lucide-react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";

import { Badge, BadgeText } from "@/components/ui/badge";
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
import { useAppTopInset } from "@/hooks/useAppInsets";
import { useAuthStore } from "@/stores/auth.store";
import { useSocialStore } from "@/stores/social.store";
import { formatCompactNumber } from "@/utils/formatNumber";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { AnimatedStatNumber } from "../NumberFormatter";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Pressable } from "react-native";
import { ROUTES } from "@/routes";

const PROFILE_TABS = ["image", "video", "audio", "text"] as const;

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

// ─── Account menu tile — one entry in the profile actionsheet grid ─────
interface ProfileMenuTileProps {
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBgClassName: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function ProfileMenuTile({
  icon,
  iconColor,
  iconBgClassName,
  title,
  subtitle,
  onPress,
}: ProfileMenuTileProps) {
  return (
    <ActionsheetItem onPress={onPress}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        className="flex-1 border border-secondary bg-card p-4 active:opacity-90"
      >
        <View
          className={`mb-3 h-9 w-9 items-center justify-center rounded-xl ${iconBgClassName}`}
        >
          <Icon as={icon} size={"xl"} color={iconColor} />
        </View>
        <Text className="text-[14px] font-bold text-foreground">
          {title}
        </Text>
        <Text className="mt-1 text-[10px] text-muted-foreground">
          {subtitle}
        </Text>
      </Pressable>
    </ActionsheetItem>
  );
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

const ListHeader = ({
  profile,
  stats,
  isOtherUser,
  setActiveTab,
  activeTab,
  showBackButton,
}: ListHeaderProps) => {
  const userDetail = {
    name: profile.firstName + " " + profile.lastName,
    referral: profile.referralCode,
    cover: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${profile.coverPhoto}/jpeg/720`,
    avatar: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${profile.avatar}/jpeg/720`,
    username: profile.username,
    bio: profile.bio,
    post: stats.post,
    following: stats.following,
    followers: stats.follower,
  };
  const { t } = useTranslation();
  const topInset = useAppTopInset();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const points = useSocialStore((state) => state.points);
  const logout = useAuthStore((state) => state.logout);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    handleClose();
    logout();
  };

  return (
    <VStack space="sm">
      <Box className="relative h-64 w-full bg-muted ">
        <Image
          source={userDetail.cover}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
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
              <Icon as={ArrowLeftIcon} className="size-5 text-white" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              accessibilityRole="button"
              accessibilityLabel={t("profile.sparks_balance", {
                count: points,
              })}
              onPress={() => setShowActionsheet(true)}
              className="rounded-full opacity-70"
            >
              <ButtonIcon
                as={Star}
                className="text-yellow-500 fill-yellow-500"
              />
              <Text className="font-semibold text-white">
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
              onPress={() => setShowActionsheet(true)}
              className="rounded-full h-12 w-12 opacity-80"
            >
              <ButtonIcon size="lg" as={MoreHorizontal} />
            </Button>
          )}
        </HStack>
      </Box>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <ActionsheetItem onPress={() => {}}>
            <ActionsheetItemText>
              {userDetail?.referral || t("common.not_available")}
            </ActionsheetItemText>
          </ActionsheetItem>
          <Grid _extra={{ className: "grid-cols-2" }}>
            <GridItem _extra={{ className: "col-span-1" }}>
              <ProfileMenuTile
                icon={User}
                iconColor="#3B82F6"
                iconBgClassName="bg-blue-500/10 dark:bg-blue-500/20"
                title={t("profile_bottom_sheet.edit_profile")}
                subtitle={t("profile_bottom_sheet.update_name_avatar")}
                onPress={() => {
                  handleClose();
                  // router.push(ROUTES.USER.EDIT_PROFILE);
                }}
              />
            </GridItem>
            <GridItem _extra={{ className: "col-span-1" }}>
              <ProfileMenuTile
                icon={Settings}
                iconColor="#64748B"
                iconBgClassName="bg-slate-500/10 dark:bg-slate-500/20"
                title={t("profile_bottom_sheet.settings")}
                subtitle={t("profile_bottom_sheet.preferences_controls")}
                onPress={() => {
                  handleClose();
                  // router.push(ROUTES.USER.SETTINGS);
                }}
              />
            </GridItem>
            <GridItem _extra={{ className: "col-span-1" }}>
              <ProfileMenuTile
                icon={Sparkles}
                iconColor="#F59E0B"
                iconBgClassName="bg-amber-500/10 dark:bg-amber-500/20"
                title={t("profile_bottom_sheet.sparks_coins")}
                subtitle={t("profile_bottom_sheet.view_points_history")}
                onPress={() => {
                  handleClose();
                  // router.push(ROUTES.USER.POINTS);
                }}
              />
            </GridItem>
            <GridItem _extra={{ className: "col-span-1" }}>
              <ProfileMenuTile
                icon={LogOut}
                iconColor="#EF4444"
                iconBgClassName="bg-red-500/10 dark:bg-red-500/20"
                title={t("profile_bottom_sheet.log_out")}
                subtitle={t("profile_bottom_sheet.sign_out_app")}
                onPress={() => setShowLogoutConfirm(true)}
              />
            </GridItem>
          </Grid>
        </ActionsheetContent>
      </Actionsheet>
      <AlertDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md" className="text-foreground">
              {t("profile_bottom_sheet.log_out")}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-muted-foreground">
              {t("profile_bottom_sheet.confirm_logout")}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onPress={() => setShowLogoutConfirm(false)}
            >
              <ButtonText>{t("profile_bottom_sheet.cancel")}</ButtonText>
            </Button>
            <Button variant="destructive" onPress={handleConfirmLogout}>
              <ButtonText>{t("profile_bottom_sheet.log_out")}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <HStack className="">
        {/* Avatar with overlays */}
        <Button
          variant="ghost"
          //   onPress={() => !isOtherUser && router.push(ROUTES.USER.EDIT_PROFILE)}
          accessibilityRole="button"
          accessibilityLabel={
            isOtherUser ? t("profile.avatar") : t("profile.edit_avatar")
          }
          className="relative -mt-12 active:opacity-80"
        >
          <Box className="h-28 w-28 overflow-hidden rounded-full border-4 border-background bg-background">
            <Image
              source={{ uri: userDetail.avatar }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </Box>

          {!isOtherUser && (
            <Box className="absolute right-4 bottom-4 h-6 w-6 bg-foreground rounded-full items-center justify-center ring-2 ring-background">
              <Icon as={Pencil} className="h-3.5 w-3.5 text-background" />
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
              // onPress={() =>
              //   router.push(`${ROUTES.USER.NETWORK}?userId=${targetId}&tab=followers` as any)
              // }
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
              // onPress={() =>
              //   router.push(`${ROUTES.USER.NETWORK}?userId=${targetId}&tab=following` as any)
              // }
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
      <VStack space="xs" className="px-4">
        <HStack space="sm" className="items-center">
          <Heading size="xl" className="">
            {userDetail.name}
          </Heading>
          <Badge variant="outline" className="h-6 py-0 rounded-full">
            <BadgeText className="lowercase line-clamp-1">
              @{userDetail.username}
            </BadgeText>
          </Badge>
        </HStack>
        <Text className="mt-1.5 text-[14px] leading-5 text-foreground">
          {userDetail.bio}
        </Text>
      </VStack>

      <Tabs
        value={activeTab}
        onValueChange={(val: ProfileTab) => setActiveTab(val)}
        variant="underlined"
        className=" justify-between"
        orientation="horizontal"
      >
        <TabsList className="bg-transparent rounded-none border-t border-border">
          <TabsTrigger value="image" className=" flex-1">
            <TabsTriggerIcon as={ImageIcon} className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger value="video" className="flex-1">
            <TabsTriggerIcon as={Video} className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex-1">
            <TabsTriggerIcon as={Music} className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger value="text" className="flex-1">
            <TabsTriggerIcon as={FileText} className="w-6 h-6" />
          </TabsTrigger>
          <TabsIndicator />
        </TabsList>
      </Tabs>
    </VStack>
  );
};

export default ListHeader;
