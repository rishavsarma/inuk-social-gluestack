import React from "react";

import { Href, router } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Pressable } from "@/components/ui/pressable";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { FollowButton } from "@/components/custom/FollowButton";

import { useProfileCardData } from "@/hooks/useProfile";

import { ROUTES } from "@/routes";

interface SuggestedProfileCardProps {
  profile: NetworkProfileItem;
  isSelf?: boolean;
  isFollowLoading?: boolean;
  onToggleFollow?: (profile: NetworkProfileItem) => void;
}

function SuggestedProfileCard({
  profile,
  isSelf = false,
  isFollowLoading = false,
  onToggleFollow,
}: SuggestedProfileCardProps) {
  const { t } = useTranslation();
  const { fullName, avatarUrl } = useProfileCardData(profile);

  return (
    <Pressable
      onPress={() => router.push(ROUTES.USER.PROFILE(profile.id) as Href)}
      accessibilityRole="button"
      accessibilityLabel={fullName}
      className="w-36 items-center rounded-2xl border border-border bg-card p-3 active:opacity-70"
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
      <Text
        numberOfLines={1}
        size="sm"
        className="mt-2 w-full text-center font-baloo-semibold text-foreground"
      >
        {fullName}
      </Text>
      {profile.username ? (
        <Text
          numberOfLines={1}
          size="xs"
          className="w-full text-center text-muted-foreground"
        >
          @{profile.username}
        </Text>
      ) : null}
      {!isSelf && onToggleFollow ? (
        <FollowButton
          isFollowing={!!profile.isFollowing}
          isFollowLoading={isFollowLoading}
          displayName={fullName}
          onPress={() => onToggleFollow(profile)}
          size="sm"
          variant="default"
          outlineWhenFollowing
          showSpinnerWhenLoading
          showIcon={false}
          className="mt-3 w-full"
        />
      ) : null}
    </Pressable>
  );
}

export function SuggestedProfileCardSkeleton() {
  return (
    <VStack space="sm" className="w-36 items-center rounded-2xl border border-border bg-card p-3">
      <Skeleton variant="circular" className="h-16 w-16" />
      <SkeletonText className="h-3 w-24" />
      <SkeletonText className="h-3 w-16" />
      <Skeleton variant="rounded" className="h-8 w-full" />
    </VStack>
  );
}

export default React.memo(SuggestedProfileCard);
