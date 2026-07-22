import React, { useState } from "react";

import { useColorScheme } from "react-native";

import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { ARENA_QUIZ } from "@/constants/mock-data";
import { WEB_BORDER_LINE, WEB_FONT_BODY, WEB_FONT_ROUND, WEB_PALETTE, WEB_TEXT_SUB } from "@/constants/web-reference-theme";

function ArenaQuizPanel() {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const isDark = useColorScheme() === "dark";
  const item = ARENA_QUIZ[i];

  const next = () => {
    setSel(null);
    setI((prev) => (prev + 1) % ARENA_QUIZ.length);
  };

  return (
    <VStack>
      <Box className="mb-3 flex-row justify-between">
        <Text className={`${WEB_FONT_ROUND[800]} text-base ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
          Daily Quiz
        </Text>
        <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-xs`}>
          Q{i + 1} / {ARENA_QUIZ.length} · 0:18
        </Text>
      </Box>
      <Box
        style={{ backgroundColor: isDark ? "#20233B" : "#F0F0F3" }}
        className="mb-4 h-1.25 overflow-hidden rounded-full"
      >
        <Box
          style={{ backgroundColor: WEB_PALETTE.red, width: `${((i + 1) / ARENA_QUIZ.length) * 100}%` }}
          className="h-1.25 rounded-full"
        />
      </Box>
      <Text className={`${WEB_FONT_ROUND[700]} mb-4 text-base ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
        {item.q}
      </Text>
      {item.opts.map((o, k) => {
        const on = sel === k;
        return (
          <Pressable
            key={o}
            onPress={() => setSel(k)}
            style={{
              borderColor: on ? WEB_PALETTE.red : undefined,
              backgroundColor: on ? (isDark ? "#3A1E18" : "#FBEAE4") : "transparent",
            }}
            className={`mb-2 flex-row items-center gap-3 rounded-box border-[1.5px] p-3 ${on ? "" : WEB_BORDER_LINE}`}
          >
            <Box
              style={{ borderColor: on ? WEB_PALETTE.red : isDark ? "#C4C8DB" : "rgba(27,31,59,0.6)" }}
              className="h-5.5 w-5.5 items-center justify-center rounded-full border-[1.5px]"
            >
              <Text
                style={{ color: on ? WEB_PALETTE.red : undefined }}
                className={`text-xs ${on ? "" : WEB_TEXT_SUB}`}
              >
                {String.fromCharCode(65 + k)}
              </Text>
            </Box>
            <Text className={`${WEB_FONT_BODY[400]} text-sm ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
              {o}
            </Text>
          </Pressable>
        );
      })}
      <Box className="mb-4 mt-2 flex-row justify-between">
        <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-xs`}>+5 Sparks · 7-day streak</Text>
        <Text style={{ color: WEB_PALETTE.red }} className={`${WEB_FONT_BODY[400]} text-xs`}>
          Answer after each ›
        </Text>
      </Box>
      <Pressable
        onPress={next}
        style={{ backgroundColor: WEB_PALETTE.red }}
        className="h-11 items-center justify-center rounded-full"
      >
        <Text className={`${WEB_FONT_ROUND[700]} text-sm text-white`}>Next question</Text>
      </Pressable>
    </VStack>
  );
}

export default ArenaQuizPanel;
