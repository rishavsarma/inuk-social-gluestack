import React from "react";

import { formatDistanceToNowStrict } from "date-fns";
import { Trophy } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { ImagePlaceholder } from "@/components/custom/ImagePlaceholder";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface ArenaContestBannerProps {
  contest: ArenaContestItem;
}

function ArenaContestBanner({ contest }: ArenaContestBannerProps) {
  const { t } = useTranslation();

  return (
    <Card className="gap-3 overflow-hidden rounded-2xl p-0">
      <ImagePlaceholder
        icon={Trophy}
        tint={contest.tint ?? "green"}
        iconSize="xl"
        className="h-28 w-full"
      />
      <VStack space="xs" className="px-4 pb-4">
        {(contest.category || contest.location) && (
          <Badge variant="outline" className="self-start rounded-full">
            <BadgeText className="uppercase">
              {[contest.category, contest.location].filter(Boolean).join(" · ")}
            </BadgeText>
          </Badge>
        )}
        <Heading size="lg" className="text-foreground">
          {contest.title}
        </Heading>
        <Text size="sm" className="text-muted-foreground">
          {t("arena.featured_ends_in", {
            time: formatDistanceToNowStrict(contest.endsAt, {
              addSuffix: false,
            }),
            count: contest.entriesCount,
          })}
        </Text>
      </VStack>
    </Card>
  );
}

export default React.memo(ArenaContestBanner);
