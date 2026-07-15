import { AwardBadge } from "@/components/custom/post/AwardBadge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PostAwardsCardProps {
  postId?: string;
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

export const PostAwardsSkeleton = React.memo(function PostAwardsSkeleton() {
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

// ─── Award Item ────────────────────────────────────────────────────────────

export interface AwardItemProps {
  item: Award;
  /** i18n key for the accessibility label — lets callers (e.g. badges) reuse
   * this same item layout with their own wording. */
  a11yKey?: string;
}

export const AwardItem = React.memo(function AwardItem({
  item,
  a11yKey = "post_detail.award_a11y",
}: AwardItemProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      accessible
      accessibilityLabel={t(a11yKey, {
        label: item.label,
        value: item.value,
      })}
      className="items-center active:opacity-70"
    >
      <AwardBadge
        shape={item.shape}
        label={item.label}
        period={item.period}
        rank={item.rank}
        suffix={item.suffix}
        theme={item.theme}
        size={96}
      />
      <VStack space="xs" className="mt-2 items-center">
        <Text
          className="text-[11px] font-bold uppercase tracking-widest text-foreground/70"
          numberOfLines={1}
        >
          {item.label}
        </Text>
        <Text
          className="text-[10px] text-foreground/40 font-medium"
          numberOfLines={1}
        >
          {item.period}
        </Text>
      </VStack>
    </Pressable>
  );
});

// ─── Component ─────────────────────────────────────────────────────────────

export const PostAwardsCard = React.memo(function PostAwardsCard({
  postId = "12121212",
}: PostAwardsCardProps) {
  const { t } = useTranslation();

  const awards: Award[] = [
    {
      id: `mock-award-spotlight-${postId}`,
      postId,
      shape: "shield",
      theme: "gold",
      period: t("post_detail.award_spotlight.period"),
      rank: "1",
      suffix: "ST",
      label: t("post_detail.award_spotlight.label"),
      value: t("post_detail.award_spotlight.value"),
      description: t("post_detail.award_spotlight.description"),
    },
    {
      id: `mock-award-creator-${postId}`,
      postId,
      shape: "octagon",
      theme: "silver",
      period: t("post_detail.award_creator.period"),
      rank: "5",
      suffix: "%",
      label: t("post_detail.award_creator.label"),
      value: t("post_detail.award_creator.value"),
      description: t("post_detail.award_creator.description"),
    },
    {
      id: `mock-award-himalayan-${postId}`,
      postId,
      shape: "octagon-round",
      theme: "bronze",
      period: t("post_detail.award_himalayan.period"),
      rank: "10",
      suffix: "%",
      label: t("post_detail.award_himalayan.label"),
      value: t("post_detail.award_himalayan.value"),
      description: t("post_detail.award_himalayan.description"),
    },
    {
      id: `mock-award-hidden-${postId}`,
      postId,
      shape: "scallop",
      theme: "#EF4444",
      period: t("post_detail.award_choice.period"),
      rank: "WIN",
      suffix: "",
      label: t("post_detail.award_choice.label"),
      value: t("post_detail.award_choice.value"),
      description: t("post_detail.award_choice.description"),
    },
    {
      id: `mock-award-favorite-${postId}`,
      postId,
      shape: "circle",
      theme: "#3B82F6",
      period: t("post_detail.award_favorite.period"),
      rank: "TOP",
      suffix: "",
      label: t("post_detail.award_favorite.label"),
      value: t("post_detail.award_favorite.value"),
      description: t("post_detail.award_favorite.description"),
    },
  ];

  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Text className="text-app-text mb-4 text-sm font-bold uppercase tracking-wide opacity-50 dark:text-white">
          {t("post_detail.awards_highlights")}
        </Text>

        <Box className="flex-row flex-wrap justify-evenly gap-y-5">
          {awards.map((item) => (
            <AwardItem key={item.id} item={item} />
          ))}
        </Box>
      </VStack>
    </Card>
  );
});
