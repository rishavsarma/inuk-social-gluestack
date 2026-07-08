import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
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
          "p-4 items-center justify-center rounded-2xl",
          iconBgClassName,
        )}
      >
        <Icon as={icon} size="lg" className={iconClassName} />
      </Box>

      <VStack space="xs" className="">
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
        iconBgClassName: "bg-amber-100 dark:bg-[#3B2B00]",
        value: formatCount(score),
        label: t("post_detail.score"),
        iconClassName: "text-[#F59E0B] fill-[#F59E0B]",
      },
      {
        icon: Trophy,
        iconBgClassName: "bg-violet-100 dark:bg-[#1A0D33]",
        value: awardsCount.toString(),
        label: t("post_detail.awards"),
        iconClassName: "text-[#A78BFA] fill-[#A78BFA]",
      },
    ],
    [
      {
        icon: Heart,
        iconBgClassName: "bg-red-100 dark:bg-[#2D0A0A]",
        value: formatCount(likesCount),
        label: t("post_detail.likes"),
        iconClassName: "text-[#EF4444] fill-[#EF4444]",
      },
      {
        icon: MessageCircle,
        iconBgClassName: "bg-sky-100 dark:bg-[#0C2D3A]",
        value: formatCount(commentsCount),
        label: t("post_detail.comments"),
        iconClassName: "text-[#38BDF8] fill-[#38BDF8]",
      },
    ],
    [
      {
        icon: Eye,
        iconBgClassName: "bg-blue-100 dark:bg-[#0D1B33]",
        value: formatCount(viewsCount),
        label: t("post_detail.views"),
        iconClassName: "text-[#3B82F6]",
      },
      {
        icon: Share2,
        iconBgClassName: "bg-green-100 dark:bg-[#0A2D14]",
        value: formatCount(sharesCount),
        label: t("post_detail.shares"),
        iconClassName: "text-[#22C55E]",
      },
    ],
  ];

  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Text className="text-app-text mb-4 text-sm font-bold uppercase tracking-wide opacity-50 dark:text-white">
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
