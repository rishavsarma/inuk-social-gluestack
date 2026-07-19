import React, { useCallback, useMemo, useState } from "react";

import { isThisWeek, isToday } from "date-fns";
import { Bell, Heart, MessageCircle, Trophy, UserPlus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Href, router } from "expo-router";

import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useGetNotifications } from "@/hooks/useNotifications";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { ROUTES } from "@/routes";

import { EmptyState } from "@/components/custom/feed/EmptyState";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

const NOTIFICATION_ICONS: Record<string, React.ComponentType<any>> = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
  AWARD: Trophy,
};

type NotificationFilter = "all" | "activity" | "follows" | "awards";
const NOTIFICATION_FILTERS: NotificationFilter[] = [
  "all",
  "activity",
  "follows",
  "awards",
];

type NotificationListEntry =
  | { kind: "header"; id: string; label: string }
  | { kind: "notification"; id: string; notification: NotificationItem };

const NotificationRow = ({ item }: { item: NotificationItem }) => {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo(item.createdAt ?? item.dateCreated);
  const isUnread = item.isRead === false || item.read === false;

  const fallbackIcon = NOTIFICATION_ICONS[item.type ?? ""] ?? Bell;
  const message = item.message ?? item.body ?? item.title ?? "";
  const avatarUrl = item.actor?.avatar
    ? `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${item.actor.avatar}/jpeg/150`
    : undefined;

  const handlePress = useCallback(() => {
    if (item.postId && item.mediaId) {
      router.push(
        ROUTES.CONTENT.POST_DETAILS(item.mediaId, item.postId) as Href,
      );
      return;
    }
    if (item.actor?.id) {
      router.push(ROUTES.USER.PROFILE(item.actor.id) as Href);
    }
  }, [item]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={message}
      className="active:opacity-70"
    >
      <HStack space="md" className="items-center px-4 py-3">
        {item.actor?.avatar ? (
          <Avatar className="h-11 w-11">
            <AvatarFallbackText>
              {item.actor?.name ?? item.actor?.username}
            </AvatarFallbackText>
            <AvatarImage
              source={{ uri: avatarUrl }}
              alt={t("profile.avatar_alt", {
                name: item.actor?.name ?? item.actor?.username ?? t("common.user"),
              })}
            />
          </Avatar>
        ) : (
          <Box className="h-11 w-11 items-center justify-center rounded-full bg-theme/10">
            <Icon as={fallbackIcon} size="md" className="text-theme" />
          </Box>
        )}
        <VStack className="flex-1">
          <Text
            size="sm"
            className={isUnread ? "font-semibold text-foreground" : "text-foreground"}
          >
            {message}
          </Text>
          {timeAgo ? (
            <Text size="xs" className="text-muted-foreground">
              {timeAgo}
            </Text>
          ) : null}
        </VStack>
        {isUnread ? (
          <Box
            className="h-2 w-2 rounded-full bg-theme"
            accessibilityLabel={t("notifications.unread")}
          />
        ) : null}
      </HStack>
    </Pressable>
  );
};

const NotificationsScreen = () => {
  const { t } = useTranslation();
  const {
    data: notifications = [],
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useGetNotifications();

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "activity") {
      return notifications.filter(
        (item) => item.type === "LIKE" || item.type === "COMMENT",
      );
    }
    if (activeFilter === "follows") {
      return notifications.filter((item) => item.type === "FOLLOW");
    }
    if (activeFilter === "awards") {
      return notifications.filter((item) => item.type === "AWARD");
    }
    return notifications;
  }, [notifications, activeFilter]);

  const groupedEntries = useMemo<NotificationListEntry[]>(() => {
    const groups: { label: string; items: NotificationItem[] }[] = [
      { label: t("notifications.group_today"), items: [] },
      { label: t("notifications.group_this_week"), items: [] },
      { label: t("notifications.group_earlier"), items: [] },
    ];

    filteredNotifications.forEach((item) => {
      const rawDate = item.createdAt ?? item.dateCreated;
      const date = rawDate ? new Date(rawDate) : null;
      if (date && isToday(date)) {
        groups[0].items.push(item);
      } else if (date && isThisWeek(date, { weekStartsOn: 1 })) {
        groups[1].items.push(item);
      } else {
        groups[2].items.push(item);
      }
    });

    return groups.flatMap((group) =>
      group.items.length === 0
        ? []
        : [
            {
              kind: "header" as const,
              id: `header-${group.label}`,
              label: group.label,
            },
            ...group.items.map((item) => ({
              kind: "notification" as const,
              id: item.id,
              notification: item,
            })),
          ],
    );
  }, [filteredNotifications, t]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NotificationListEntry>) =>
      item.kind === "header" ? (
        <Text className="px-4 pb-2 pt-5 font-baloo-bold text-xs uppercase tracking-wider text-muted-foreground">
          {item.label}
        </Text>
      ) : (
        <NotificationRow item={item.notification} />
      ),
    [],
  );

  const filterTabs = (
    <Tabs
      value={activeFilter}
      onValueChange={(value: NotificationFilter) => setActiveFilter(value)}
      variant="underlined"
      orientation="horizontal"
      className="px-4 pt-1"
    >
      <TabsList className="bg-transparent rounded-none pb-0.5">
        {NOTIFICATION_FILTERS.map((filter) => (
          <TabsTrigger key={filter} value={filter} className="flex-1">
            <TabsTriggerText>
              {t(`notifications.filter_${filter}`)}
            </TabsTriggerText>
          </TabsTrigger>
        ))}
        <TabsIndicator className="border-b" />
      </TabsList>
    </Tabs>
  );

  const listEmptyComponent = isLoading ? (
    <Box className="items-center py-20">
      <Spinner />
    </Box>
  ) : isError ? (
    <EmptyState
      icon={Bell}
      title={t("notifications.error_title")}
      description={t("notifications.error_sub")}
      actionLabel={t("notifications.retry")}
      onAction={refetch}
      fullScreen={false}
    />
  ) : notifications.length > 0 ? (
    <EmptyState
      icon={Bell}
      title={t("notifications.empty_filtered")}
      description={t("notifications.empty_filtered_sub")}
      fullScreen={false}
    />
  ) : (
    <EmptyState
      icon={Bell}
      title={t("notifications.empty")}
      description={t("notifications.empty_sub")}
      fullScreen={false}
    />
  );

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("notifications.title")}
      variant="list"
    >
      {({ scrollProps, topInset }) => (
        <FlashList
          data={groupedEntries}
          renderItem={renderItem}
          keyExtractor={(entry: NotificationListEntry) => entry.id}
          getItemType={(entry: NotificationListEntry) => entry.kind}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListHeaderComponent={
            !isLoading && !isError && notifications.length > 0
              ? filterTabs
              : null
          }
          ListEmptyComponent={listEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: topInset,
            paddingBottom: 120,
          }}
          {...scrollProps}
        />
      )}
    </KeyboardAvoidingScrollView>
  );
};

export default NotificationsScreen;
