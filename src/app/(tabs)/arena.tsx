import { useCallback, useState } from "react";

import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

import ArenaContestRow from "@/components/custom/arena/ArenaContestRow";
import ArenaLeaderboardRow from "@/components/custom/arena/ArenaLeaderboardRow";
import ArenaQuizPanel from "@/components/custom/arena/ArenaQuizPanel";
import ArenaRewardsPanel from "@/components/custom/arena/ArenaRewardsPanel";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

import { ARENA_FEATURED, ARENA_OPEN, ARENA_PODIUM } from "@/constants/mock-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND, WEB_PALETTE, WEB_TEXT_INK, WEB_TEXT_SUB } from "@/constants/web-reference-theme";
import { ROUTES } from "@/routes";

const TABS = ["Contests", "Quizzes", "Leaderboard", "Rewards"] as const;
type ArenaTab = (typeof TABS)[number];

const TAB_LABEL_KEYS: Record<ArenaTab, string> = {
  Contests: "arena.tab_contests",
  Quizzes: "arena.tab_quizzes",
  Leaderboard: "arena.tab_leaderboard",
  Rewards: "arena.tab_rewards",
};

const EXTENDED_LEADERBOARD: WebArenaPodiumEntry[] = [
  ...ARENA_PODIUM,
  { rank: 4, handle: "pahadi.frames", meta: "Nature · Chopta", pts: "3.6k", medal: "#B7BCC4" },
  { rank: 5, handle: "devbhoomi.diaries", meta: "Temples · Jageshwar", pts: "3.1k", medal: "#B7BCC4" },
];

const ArenaScreen = () => {
  const { t } = useTranslation();
  const isDark = useColorScheme() === "dark";
  const [tab, setTab] = useState<ArenaTab>("Contests");

  const line = isDark ? "#2b3050" : "#E3E4EC";

  const handleStartQuiz = useCallback(() => {
    router.push(ROUTES.ARENA.QUIZ);
  }, []);

  return (
    <KeyboardAvoidingScrollView
      alwaysShowBar
      showSearch
      searchPlaceholder={t("arena.search_placeholder")}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Box style={{ borderColor: line }} className="flex-row border-b px-2">
        {TABS.map((tb) => (
          <Pressable
            key={tb}
            onPress={() => setTab(tb)}
            style={{ borderColor: tab === tb ? WEB_PALETTE.red : "transparent" }}
            className="flex-1 items-center border-b-2 py-2.75"
            accessibilityRole="button"
            accessibilityLabel={t(TAB_LABEL_KEYS[tb])}
          >
            <Text
              style={{ color: tab === tb ? WEB_PALETTE.red : undefined }}
              className={`${tab === tb ? WEB_FONT_ROUND[700] : WEB_FONT_ROUND[500]} text-[12.5px] ${
                tab === tb ? "" : WEB_TEXT_SUB
              }`}
            >
              {t(TAB_LABEL_KEYS[tb])}
            </Text>
          </Pressable>
        ))}
      </Box>

      {tab === "Contests" ? (
        <View>
          <Box className="mx-3.5 mt-3.5 overflow-hidden rounded-2xl">
            <Box style={{ backgroundColor: ARENA_FEATURED.grad0 }} className="h-32.5 justify-end p-3.5">
              <Box
                style={{ backgroundColor: ARENA_FEATURED.grad1, opacity: 0.35 }}
                className="absolute inset-0"
              />
              <Text className={`${WEB_FONT_BODY[400]} text-[10.5px] tracking-[1px] text-white opacity-90`}>
                {ARENA_FEATURED.tag}
              </Text>
              <Text className={`${WEB_FONT_ROUND[800]} mt-0.5 text-[19px] text-white`}>
                {ARENA_FEATURED.title}
              </Text>
              <Text className={`${WEB_FONT_BODY[400]} mt-0.5 text-xs text-white opacity-90`}>
                ◷ {ARENA_FEATURED.days} days left · {ARENA_FEATURED.entries} entries
              </Text>
            </Box>
          </Box>

          <Box className="mt-3 flex-row gap-2 px-3.5">
            {(
              [
                ["Daily Quiz", handleStartQuiz],
                ["Leaderboard", () => setTab("Leaderboard")],
                ["Rewards", () => setTab("Rewards")],
              ] as const
            ).map(([label, onPress]) => (
              <Pressable
                key={label}
                onPress={onPress}
                style={{ borderColor: line }}
                className="flex-1 items-center rounded-box border py-3"
              >
                <Text className={`${WEB_FONT_ROUND[700]} text-[12px] ${WEB_TEXT_INK}`}>{label}</Text>
              </Pressable>
            ))}
          </Box>

          <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mx-4.5 mb-2.5 mt-4.5 text-[13px]`}>
            OPEN CONTESTS
          </Text>
          {ARENA_OPEN.map((contest) => (
            <ArenaContestRow key={contest.title} contest={contest} />
          ))}

          <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mx-4.5 mb-2.5 mt-2 text-[13px]`}>
            THIS WEEK&apos;S PODIUM
          </Text>
          <Box className="gap-2.25 px-3.5">
            {ARENA_PODIUM.map((entry) => (
              <ArenaLeaderboardRow key={entry.rank} entry={entry} />
            ))}
          </Box>
        </View>
      ) : null}

      {tab === "Quizzes" ? (
        <Box className="p-4.5">
          <ArenaQuizPanel />
        </Box>
      ) : null}

      {tab === "Leaderboard" ? (
        <Box className="p-3.5">
          <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mx-1 mb-2.5 text-[13px]`}>
            TOP CREATORS · THIS WEEK
          </Text>
          <Box className="gap-2.25">
            {EXTENDED_LEADERBOARD.map((entry) => (
              <ArenaLeaderboardRow key={entry.rank} entry={entry} />
            ))}
          </Box>
        </Box>
      ) : null}

      {tab === "Rewards" ? <ArenaRewardsPanel /> : null}
    </KeyboardAvoidingScrollView>
  );
};

export default ArenaScreen;
