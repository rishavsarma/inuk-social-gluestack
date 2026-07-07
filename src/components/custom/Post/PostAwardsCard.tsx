import { AwardBadge } from "@/components/custom/Post/AwardBadge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as React from "react";
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

interface AwardItemProps {
  item: Award;
}

const AwardItem = React.memo(function AwardItem({ item }: AwardItemProps) {
  return (
    <Pressable
      accessible
      accessibilityLabel={`Award: ${item.label} – ${item.value}. Double tap to view details.`}
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
  const awards = [
    {
      id: `mock-award-spotlight-${postId}`,
      postId,
      shape: "shield",
      theme: "gold",
      period: "WEEK 25",
      rank: "1",
      suffix: "ST",
      label: "SPOTLIGHT",
      value: "1st Place Winner",
      description:
        "Ranked #1 in Uttarakhand weekly spotlight contest for outstanding cinematography.",
    },
    {
      id: `mock-award-creator-${postId}`,
      postId,
      shape: "octagon",
      theme: "silver",
      period: "JUNE 2026",
      rank: "5",
      suffix: "%",
      label: "CREATOR",
      value: "Top 5% Votes",
      description:
        "Awarded to creators who received votes placing them in the top 5% overall for June.",
    },
    {
      id: `mock-award-himalayan-${postId}`,
      postId,
      shape: "octagon-round",
      theme: "bronze",
      period: "2026",
      rank: "10",
      suffix: "%",
      label: "HIMALAYAN",
      value: "Top 10% Votes",
      description:
        "Recognized for ranking in the top 10% of overall engagement and community votes.",
    },
    {
      id: `mock-award-hidden-${postId}`,
      postId,
      shape: "scallop",
      theme: "#EF4444",
      period: "Q2 2026",
      rank: "WIN",
      suffix: "",
      label: "CHOICE",
      value: "Spotlight Choice",
      description:
        "Recognized for uncovering and documenting a unique, off-the-beaten-path Himalayan destination.",
    },
    {
      id: `mock-award-favorite-${postId}`,
      postId,
      shape: "circle",
      theme: "#3B82F6",
      period: "WEEK 24",
      rank: "TOP",
      suffix: "",
      label: "FAVORITE",
      value: "Most Loved Post",
      description:
        "Awarded for receiving the highest number of comments and community interactions in a single week.",
    },
  ];

  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Text className="text-app-text mb-4 text-sm font-bold uppercase tracking-wide opacity-50 dark:text-white">
          Awards & Highlights
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
