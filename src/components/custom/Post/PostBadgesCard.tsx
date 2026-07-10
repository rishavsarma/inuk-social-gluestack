import { AwardItem } from "@/components/custom/Post/PostAwardsCard";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as React from "react";
import { useTranslation } from "react-i18next";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PostBadgesCardProps {
  postId?: string;
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

export const PostBadgesSkeleton = React.memo(function PostBadgesSkeleton() {
  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Skeleton className="mb-4 h-3 w-36 rounded bg-foreground/10" />
        <Box className="flex-row flex-wrap gap-5 justify-evenly">
          {[1, 2, 3].map((i) => (
            <VStack key={i} space="xs" className="items-center">
              <Skeleton className="h-[103px] w-[96px] rounded-2xl bg-foreground/10" />
              <Skeleton className="h-2.5 w-16 rounded bg-foreground/10" />
              <Skeleton className="h-2 w-10 rounded bg-foreground/10" />
            </VStack>
          ))}
        </Box>
      </VStack>
    </Card>
  );
});

// ─── Component ─────────────────────────────────────────────────────────────

export const PostBadgesCard = React.memo(function PostBadgesCard({
  postId = "12121212",
}: PostBadgesCardProps) {
  const { t } = useTranslation();

  const badges = [
    {
      id: `mock-badge-verified-${postId}`,
      postId,
      shape: "circle",
      theme: "sapphire",
      period: t("post_detail.badge_verified.period"),
      rank: "✓",
      suffix: "",
      label: t("post_detail.badge_verified.label"),
      value: t("post_detail.badge_verified.value"),
      description: t("post_detail.badge_verified.description"),
    },
    {
      id: `mock-badge-century-${postId}`,
      postId,
      shape: "circle",
      theme: "emerald",
      period: t("post_detail.badge_century.period"),
      rank: "100",
      suffix: "",
      label: t("post_detail.badge_century.label"),
      value: t("post_detail.badge_century.value"),
      description: t("post_detail.badge_century.description"),
    },
    {
      id: `mock-badge-community-${postId}`,
      postId,
      shape: "circle",
      theme: "amethyst",
      period: t("post_detail.badge_community.period"),
      rank: "★",
      suffix: "",
      label: t("post_detail.badge_community.label"),
      value: t("post_detail.badge_community.value"),
      description: t("post_detail.badge_community.description"),
    },
  ];

  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Text className="text-app-text mb-4 text-sm font-bold uppercase tracking-wide opacity-50 dark:text-white">
          {t("post_detail.badges_highlights")}
        </Text>

        <Box className="flex-row flex-wrap justify-evenly gap-y-5">
          {badges.map((item) => (
            <AwardItem key={item.id} item={item} a11yKey="post_detail.badge_a11y" />
          ))}
        </Box>
      </VStack>
    </Card>
  );
});
