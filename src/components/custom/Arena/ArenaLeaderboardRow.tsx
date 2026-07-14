import React from "react";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { formatCompactNumber } from "@/utils/formatNumber";

interface ArenaLeaderboardRowProps {
  entry: ArenaLeaderboardEntry;
}

function ArenaLeaderboardRow({ entry }: ArenaLeaderboardRowProps) {
  const isTopThree = entry.rank <= 3;

  return (
    <HStack space="md" className="items-center px-4 py-2">
      <Box className="w-6 items-center">
        <Text
          className={
            isTopThree
              ? "text-base font-bold text-theme"
              : "text-sm font-semibold text-muted-foreground"
          }
        >
          {entry.rank}
        </Text>
      </Box>
      <Avatar className="h-9 w-9">
        <AvatarFallbackText>{entry.username}</AvatarFallbackText>
      </Avatar>
      <VStack className="flex-1">
        <Text className="text-sm font-semibold text-foreground">
          @{entry.username}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {entry.categoryLabel}
        </Text>
      </VStack>
      <Text className="text-sm font-bold text-foreground">
        {formatCompactNumber(entry.score)}
      </Text>
    </HStack>
  );
}

export default React.memo(ArenaLeaderboardRow);
