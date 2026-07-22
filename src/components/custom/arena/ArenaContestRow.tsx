import React from "react";

import { useColorScheme } from "react-native";

import ArenaRowShell from "@/components/custom/arena/ArenaRowShell";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { WEB_FONT_BODY, WEB_FONT_ROUND, WEB_PALETTE, WEB_TEXT_SUB } from "@/constants/web-reference-theme";

interface ArenaContestRowProps {
  contest: WebArenaContest;
}

function ArenaContestRow({ contest }: ArenaContestRowProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <ArenaRowShell
      className="mx-4 mb-2 p-3"
      leading={<Box style={{ backgroundColor: contest.colour }} className="h-10 w-10 rounded-[10px]" />}
      trailing={
        <VStack className="items-end">
          <Text style={{ color: WEB_PALETTE.red }} className={`${WEB_FONT_BODY[700]} text-xs`}>
            {contest.days}d left
          </Text>
          <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-xs`}>{contest.entries}</Text>
        </VStack>
      }
    >
      <VStack className="flex-1">
        <Text className={`${WEB_FONT_ROUND[700]} text-sm ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
          {contest.title}
        </Text>
        <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-xs`}>{contest.meta}</Text>
      </VStack>
    </ArenaRowShell>
  );
}

export default React.memo(ArenaContestRow);
