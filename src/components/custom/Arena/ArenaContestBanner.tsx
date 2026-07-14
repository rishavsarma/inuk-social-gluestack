import React from "react";

import { formatDistanceToNowStrict } from "date-fns";
import { useTranslation } from "react-i18next";

import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface ArenaContestBannerProps {
  contest: ArenaContestItem;
}

function ArenaContestBanner({ contest }: ArenaContestBannerProps) {
  const { t } = useTranslation();
  const tint = POST_METADATA_TINTS[contest.tint ?? "green"];

  return (
    <Card className="gap-3 overflow-hidden rounded-2xl p-0">
      <Box className={`h-28 w-full ${tint.iconBg}`} />
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
