import { useCallback, useState } from "react";

import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import ArenaContestRow from "@/components/custom/arena/ArenaContestRow";
import ArenaLeaderboardRow from "@/components/custom/arena/ArenaLeaderboardRow";
import ArenaQuizPanel from "@/components/custom/arena/ArenaQuizPanel";
import ArenaRewardsPanel from "@/components/custom/arena/ArenaRewardsPanel";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import UnderlineTabBar from "@/components/custom/UnderlineTabBar";

import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

import { ARENA_FEATURED, ARENA_OPEN, ARENA_PODIUM } from "@/constants/mock-data";
import { WEB_BORDER_LINE, WEB_FONT_BODY, WEB_FONT_ROUND, WEB_TEXT_INK, WEB_TEXT_SUB } from "@/constants/web-reference-theme";
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
  const [tab, setTab] = useState<ArenaTab>("Contests");

  const tabs = TABS.map((tb) => ({ key: tb, label: t(TAB_LABEL_KEYS[tb]) }));

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
      <UnderlineTabBar tabs={tabs} activeTab={tab} onTabChange={setTab} />

      {tab === "Contests" ? (
        <View>
          <Box className="mx-4 mt-4 overflow-hidden rounded-2xl">
            <Box style={{ backgroundColor: ARENA_FEATURED.grad0 }} className="h-32.5 justify-end p-4">
              <Box
                style={{ backgroundColor: ARENA_FEATURED.grad1, opacity: 0.35 }}
                className="absolute inset-0"
              />
              <Text className={`${WEB_FONT_BODY[400]} text-xs tracking-[1px] text-white opacity-90`}>
                {ARENA_FEATURED.tag}
              </Text>
              <Text className={`${WEB_FONT_ROUND[800]} mt-1 text-xl text-white`}>
                {ARENA_FEATURED.title}
              </Text>
              <Text className={`${WEB_FONT_BODY[400]} mt-1 text-xs text-white opacity-90`}>
                ◷ {ARENA_FEATURED.days} days left · {ARENA_FEATURED.entries} entries
              </Text>
            </Box>
          </Box>

          <Box className="mt-3 flex-row gap-2 px-4">
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
                className={`flex-1 items-center rounded-box border py-3 ${WEB_BORDER_LINE}`}
              >
                <Text className={`${WEB_FONT_ROUND[700]} text-xs ${WEB_TEXT_INK}`}>{label}</Text>
              </Pressable>
            ))}
          </Box>

          <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mx-4 mb-3 mt-4 text-sm`}>
            OPEN CONTESTS
          </Text>
          {ARENA_OPEN.map((contest) => (
            <ArenaContestRow key={contest.title} contest={contest} />
          ))}

          <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mx-4 mb-3 mt-2 text-sm`}>
            THIS WEEK&apos;S PODIUM
          </Text>
          <Box className="gap-2 px-4">
            {ARENA_PODIUM.map((entry) => (
              <ArenaLeaderboardRow key={entry.rank} entry={entry} />
            ))}
          </Box>
        </View>
      ) : null}

      {tab === "Quizzes" ? (
        <Box className="p-4">
          <ArenaQuizPanel />
        </Box>
      ) : null}

      {tab === "Leaderboard" ? (
        <Box className="p-4">
          <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mx-1 mb-3 text-sm`}>
            TOP CREATORS · THIS WEEK
          </Text>
          <Box className="gap-2">
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
