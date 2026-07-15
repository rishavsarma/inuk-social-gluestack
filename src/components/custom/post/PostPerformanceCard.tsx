import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import type { LucideIcon } from "lucide-react-native";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Trophy,
} from "lucide-react-native";
import * as React from "react";
import { useTranslation } from "react-i18next";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PostPerformanceCardProps {
  likesCount: number;
  commentsCount?: number;
  viewsCount?: number;
  sharesCount?: number;
  awardsCount?: number;
  score?: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ─── Stat Item ─────────────────────────────────────────────────────────────

interface StatItemProps {
  icon: LucideIcon;
  iconBgClassName: string;
  value: string;
  label: string;
  iconClassName: string;
}

const StatItem = React.memo(function StatItem({
  icon,
  iconBgClassName,
  value,
  label,
  iconClassName,
}: StatItemProps) {
  return (
    <HStack className="flex-1 flex-row items-center gap-3">
      <Box
        className={cn(
          "p-2.5 items-center justify-center rounded-lg",
          iconBgClassName,
        )}
      >
        <Icon as={icon} size="sm" className={iconClassName} />
      </Box>

      <VStack className="">
        <Text className="text-xs text-foreground/50">{label}</Text>
        <Text className="text-base font-bold text-foreground">{value}</Text>
      </VStack>
    </HStack>
  );
});

// ─── Component ─────────────────────────────────────────────────────────────

export const PostPerformanceCard = React.memo(function PostPerformanceCard({
  likesCount,
  commentsCount = 0,
  viewsCount = 0,
  sharesCount = 0,
  awardsCount = 0,
  score = 0,
}: PostPerformanceCardProps) {
  const { t } = useTranslation();

  const rows: [StatItemProps, StatItemProps | null][] = [
    [
      {
        icon: Star,
        iconBgClassName: POST_METADATA_TINTS.amber.iconBg,
        value: formatCount(score),
        label: t("post_detail.score"),
        iconClassName: POST_METADATA_TINTS.amber.iconColorFilled,
      },
      {
        icon: Trophy,
        iconBgClassName: POST_METADATA_TINTS.violet.iconBg,
        value: awardsCount.toString(),
        label: t("post_detail.awards"),
        iconClassName: POST_METADATA_TINTS.violet.iconColorFilled,
      },
    ],
    [
      {
        icon: Heart,
        iconBgClassName: POST_METADATA_TINTS.red.iconBg,
        value: formatCount(likesCount),
        label: t("post_detail.likes"),
        iconClassName: POST_METADATA_TINTS.red.iconColorFilled,
      },
      {
        icon: MessageCircle,
        iconBgClassName: POST_METADATA_TINTS.sky.iconBg,
        value: formatCount(commentsCount),
        label: t("post_detail.comments"),
        iconClassName: POST_METADATA_TINTS.sky.iconColorFilled,
      },
    ],
    [
      {
        icon: Eye,
        iconBgClassName: POST_METADATA_TINTS.blue.iconBg,
        value: formatCount(viewsCount),
        label: t("post_detail.views"),
        iconClassName: POST_METADATA_TINTS.blue.iconColor,
      },
      {
        icon: Share2,
        iconBgClassName: POST_METADATA_TINTS.green.iconBg,
        value: formatCount(sharesCount),
        label: t("post_detail.shares"),
        iconClassName: POST_METADATA_TINTS.green.iconColor,
      },
    ],
  ];

  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Text
          size="xs"
          className="text-app-text mb-4 font-bold uppercase tracking-wide opacity-50 dark:text-white"
        >
          {t("post_detail.performance")}
        </Text>
        <Box className="gap-4">
          {rows.map((row, rowIdx) => (
            <Box key={rowIdx} className="flex-row gap-4">
              <StatItem {...row[0]} />
              {row[1] ? <StatItem {...row[1]} /> : <Box className="flex-1" />}
            </Box>
          ))}
        </Box>
      </VStack>
    </Card>
  );
});
