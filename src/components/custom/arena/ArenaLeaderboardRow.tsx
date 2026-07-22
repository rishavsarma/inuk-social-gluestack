import React from "react";

import { useColorScheme } from "react-native";

import ArenaRowShell from "@/components/custom/arena/ArenaRowShell";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { WEB_FONT_BODY, WEB_FONT_ROUND, WEB_TEXT_SUB } from "@/constants/web-reference-theme";

interface ArenaLeaderboardRowProps {
  entry: WebArenaPodiumEntry;
}

function ArenaLeaderboardRow({ entry }: ArenaLeaderboardRowProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <ArenaRowShell
      className="mb-2 p-3"
      leading={
        <Box style={{ backgroundColor: entry.medal }} className="h-8 w-8 items-center justify-center rounded-[10px]">
          <Text className={`${WEB_FONT_ROUND[800]} text-sm text-white`}>{entry.rank}</Text>
        </Box>
      }
      trailing={<Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-xs`}>{entry.pts}</Text>}
    >
      <VStack className="flex-1">
        <Text className={`${WEB_FONT_ROUND[700]} text-sm ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
          @{entry.handle} ✓
        </Text>
        <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-xs`}>{entry.meta}</Text>
      </VStack>
    </ArenaRowShell>
  );
}

export default React.memo(ArenaLeaderboardRow);
