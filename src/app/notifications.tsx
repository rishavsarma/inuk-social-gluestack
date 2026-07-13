import React, { useCallback, useState } from "react";

import { Bell, Heart, MessageCircle, Trophy, UserPlus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Href, router } from "expo-router";

import { FlashList } from "@shopify/flash-list";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useTimeAgo } from "@/hooks/useTimeAgo";
import { ROUTES } from "@/routes";

import { MOCK_NOTIFICATIONS } from "@/constants/mock-data";

import { EmptyState } from "@/components/custom/Feed/EmptyState";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

const NOTIFICATION_ICONS: Record<string, React.ComponentType<any>> = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
  AWARD: Trophy,
};

function NotificationRow({ item }: { item: NotificationItem }) {
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
}

const NotificationsScreen = () => {
  const { t } = useTranslation();
  const [notifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data is already resolved locally — refresh just settles the gesture.
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => <NotificationRow item={item} />,
    [],
  );

  const listEmptyComponent = (
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
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item: NotificationItem) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
