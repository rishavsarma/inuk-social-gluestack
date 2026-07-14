import React from "react";

import { formatDistanceToNowStrict } from "date-fns";
import { Clock, Gift, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const STATUS_BADGE_VARIANT: Record<
  ArenaContestStatus,
  "default" | "outline" | "secondary"
> = {
  ACTIVE: "default",
  UPCOMING: "outline",
  ENDED: "secondary",
};

interface ArenaContestCardProps {
  contest: ArenaContestItem;
  onPress: (contest: ArenaContestItem) => void;
}

function ArenaContestCard({ contest, onPress }: ArenaContestCardProps) {
  const { t } = useTranslation();
  const isEnded = contest.status === "ENDED";

  const timeLabel = isEnded
    ? t("arena.ended_ago", {
        time: formatDistanceToNowStrict(contest.endsAt, { addSuffix: false }),
      })
    : t("arena.ends_in", {
        time: formatDistanceToNowStrict(contest.endsAt, { addSuffix: false }),
      });

  return (
    <Card className="gap-3 rounded-2xl">
      <HStack className="items-start justify-between">
        <VStack className="flex-1 gap-1 pr-2">
          <Heading size="sm" className="text-foreground">
            {contest.title}
          </Heading>
          <Text size="sm" className="text-muted-foreground">
            {contest.description}
          </Text>
        </VStack>
        <Badge
          variant={STATUS_BADGE_VARIANT[contest.status]}
          className="rounded-full"
        >
          <BadgeText>{t(`arena.status_${contest.status}`)}</BadgeText>
        </Badge>
      </HStack>

      <HStack space="lg" className="items-center">
        <HStack space="xs" className="items-center">
          <Icon as={Gift} size="sm" className="text-theme" />
          <Text size="xs" className="text-muted-foreground">
            {t("arena.prize_pool", { prize: contest.prize })}
          </Text>
        </HStack>
        <HStack space="xs" className="items-center">
          <Icon as={Users} size="sm" className="text-muted-foreground" />
          <Text size="xs" className="text-muted-foreground">
            {t("arena.participants", { count: contest.entriesCount })}
          </Text>
        </HStack>
        <HStack space="xs" className="items-center">
          <Icon as={Clock} size="sm" className="text-muted-foreground" />
          <Text size="xs" className="text-muted-foreground">
            {timeLabel}
          </Text>
        </HStack>
      </HStack>

      <Button
        variant={isEnded ? "outline" : "theme"}
        disabled={isEnded}
        onPress={() => onPress(contest)}
        accessibilityRole="button"
        accessibilityLabel={t(
          isEnded ? "arena.view_results_a11y" : "arena.join_a11y",
          { title: contest.title },
        )}
        className="rounded-full"
      >
        <ButtonText className={isEnded ? "" : "text-white"}>
          {t(isEnded ? "arena.view_results" : "arena.join_contest")}
        </ButtonText>
      </Button>
    </Card>
  );
}

export default React.memo(ArenaContestCard);
