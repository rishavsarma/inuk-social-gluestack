import React from "react";

import { Href, router } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { FollowButton } from "@/components/custom/FollowButton";

import { useProfileCardData } from "@/hooks/useProfile";

import { ROUTES } from "@/routes";

interface ProfileListItemProps {
  profile: NetworkProfileItem;
  isSelf?: boolean;
  isFollowLoading?: boolean;
  onToggleFollow?: (profile: NetworkProfileItem) => void;
}

function ProfileListItem({
  profile,
  isSelf = false,
  isFollowLoading = false,
  onToggleFollow,
}: ProfileListItemProps) {
  const { t } = useTranslation();
  const { fullName, avatarUrl } = useProfileCardData(profile);

  return (
    <Pressable
      onPress={() => router.push(ROUTES.USER.PROFILE(profile.id) as Href)}
      accessibilityRole="button"
      accessibilityLabel={fullName}
      className="active:opacity-70 bg-card my-1"
    >
      <HStack space="md" className="items-center px-4 py-3">
        <Avatar className="h-12 w-12">
          <AvatarFallbackText>{fullName}</AvatarFallbackText>
          {avatarUrl ? (
            <AvatarImage
              source={{ uri: avatarUrl }}
              alt={t("profile.avatar_alt", { name: fullName })}
            />
          ) : null}
        </Avatar>
        <VStack className="flex-1">
          <Text size="sm" className="font-semibold text-foreground">
            {fullName}
          </Text>
          {profile.username ? (
            <Text size="xs" className="text-muted-foreground">
              @{profile.username}
            </Text>
          ) : null}
        </VStack>
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
          />
        ) : null}
      </HStack>
    </Pressable>
  );
}

export function ProfileListItemSkeleton() {
  return (
    <HStack space="md" className="items-center px-4 py-3">
      <Skeleton variant="circular" className="h-12 w-12" />
      <VStack space="xs" className="flex-1">
        <SkeletonText className="h-3 w-32" />
        <SkeletonText className="h-3 w-20" />
      </VStack>
      <Skeleton variant="rounded" className="h-8 w-20" />
    </HStack>
  );
}

export default React.memo(ProfileListItem);
