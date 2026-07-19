import React from "react";

import { useColorScheme } from "react-native";

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
    <Box
      style={{ borderColor: isDark ? "#2b3050" : "#E3E4EC" }}
      className="mx-3.5 mb-2.25 flex-row items-center gap-2.75 rounded-field border p-2.75"
    >
      <Box style={{ backgroundColor: contest.colour }} className="h-10 w-10 rounded-[10px]" />
      <VStack className="flex-1">
        <Text className={`${WEB_FONT_ROUND[700]} text-[13.5px] ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
          {contest.title}
        </Text>
        <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-[11.5px]`}>{contest.meta}</Text>
      </VStack>
      <VStack className="items-end">
        <Text style={{ color: WEB_PALETTE.red }} className={`${WEB_FONT_BODY[700]} text-[11px]`}>
          {contest.days}d left
        </Text>
        <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-[11px]`}>{contest.entries}</Text>
      </VStack>
    </Box>
  );
}

export default React.memo(ArenaContestRow);
