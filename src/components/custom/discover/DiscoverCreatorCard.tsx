import React from "react";

import { Href, router } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { ROUTES } from "@/routes";

interface DiscoverCreatorCardProps {
  profile: NetworkProfileItem;
  onToggleFollow: (profile: NetworkProfileItem) => void;
}

function DiscoverCreatorCard({
  profile,
  onToggleFollow,
}: DiscoverCreatorCardProps) {
  const { t } = useTranslation();

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    profile.username ||
    t("common.user");

  const avatarUrl = profile.avatar
    ? `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${profile.avatar}/jpeg/150`
    : undefined;

  return (
    <Pressable
      onPress={() => router.push(ROUTES.USER.PROFILE(profile.id) as Href)}
      accessibilityRole="button"
      accessibilityLabel={fullName}
      className="w-32 items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-4 active:opacity-80"
    >
      <Avatar className="h-16 w-16">
        <AvatarFallbackText>{fullName}</AvatarFallbackText>
        {avatarUrl ? (
          <AvatarImage
            source={{ uri: avatarUrl }}
            alt={t("profile.avatar_alt", { name: fullName })}
          />
        ) : null}
      </Avatar>
      <VStack className="items-center">
        <Text
          size="sm"
          className="text-center font-semibold text-foreground"
          numberOfLines={1}
        >
          {fullName}
        </Text>
        {profile.username ? (
          <Text
            size="xs"
            className="text-center text-muted-foreground"
            numberOfLines={1}
          >
            @{profile.username}
          </Text>
        ) : null}
      </VStack>
      <Button
        variant={profile.isFollowing ? "outline" : "theme"}
        size="sm"
        onPress={() => onToggleFollow(profile)}
        accessibilityRole="button"
        accessibilityLabel={
          profile.isFollowing
            ? t("network.unfollow_a11y", { name: fullName })
            : t("network.follow_a11y", { name: fullName })
        }
        className="w-full rounded-full"
      >
        <ButtonText className={profile.isFollowing ? "" : "text-white"}>
          {profile.isFollowing
            ? t("network.following_btn")
            : t("network.follow")}
        </ButtonText>
      </Button>
    </Pressable>
  );
}

export default React.memo(DiscoverCreatorCard);
