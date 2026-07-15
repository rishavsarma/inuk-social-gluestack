import { useCallback, useMemo, useState } from "react";

import {
  Gift,
  HelpCircle,
  Star,
  Trophy,
} from "lucide-react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import ArenaContestBanner from "@/components/custom/arena/ArenaContestBanner";
import ArenaContestCard from "@/components/custom/arena/ArenaContestCard";
import ArenaLeaderboardRow from "@/components/custom/arena/ArenaLeaderboardRow";
import ArenaQuizCard from "@/components/custom/arena/ArenaQuizCard";
import { EmptyState } from "@/components/custom/feed/EmptyState";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import {
  MOCK_ARENA_CONTESTS,
  MOCK_ARENA_LEADERBOARD,
  MOCK_ARENA_QUIZZES,
} from "@/constants/mock-data";
import { ROUTES } from "@/routes";

type ArenaSection = "contests" | "quizzes" | "leaderboard";
const SECTIONS: ArenaSection[] = ["contests", "quizzes", "leaderboard"];

const STATUS_FILTERS: ArenaContestStatus[] = ["ACTIVE", "UPCOMING", "ENDED"];

const EMPTY_DESCRIPTION_KEY: Record<ArenaContestStatus, string> = {
  ACTIVE: "arena.no_contests",
  UPCOMING: "arena.no_contests_upcoming",
  ENDED: "arena.no_contests_ended",
};

const ArenaScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState<ArenaSection>("contests");
  const [activeStatus, setActiveStatus] = useState<ArenaContestStatus>("ACTIVE");

  const featuredContest = useMemo(
    () =>
      MOCK_ARENA_CONTESTS.find((contest) => contest.status === "ACTIVE") ??
      MOCK_ARENA_CONTESTS[0],
    [],
  );

  const filteredContests = useMemo(
    () =>
      MOCK_ARENA_CONTESTS.filter((contest) => contest.status === activeStatus),
    [activeStatus],
  );

  const podium = useMemo(() => MOCK_ARENA_LEADERBOARD.slice(0, 3), []);

  const handleContestPress = useCallback(
    (contest: ArenaContestItem) => {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
            <ToastDescription>{t("arena.coming_soon")}</ToastDescription>
          </Toast>
        ),
      });
    },
    [t, toast],
  );

  const handleStartQuiz = useCallback(() => {
    router.push(ROUTES.ARENA.QUIZ);
  }, []);

  return (
    <KeyboardAvoidingScrollView>
      <VStack space="lg" className="pb-40">
        <HStack className="items-center justify-between px-4 pt-2">
          <Heading size="xl">{t("arena.title")}</Heading>
          <Button
            variant="secondary"
            size="icon"
            onPress={() => router.push(ROUTES.ARENA.REWARDS)}
            accessibilityRole="button"
            accessibilityLabel={t("arena.rewards_a11y")}
            className="h-10 w-10 rounded-full"
          >
            <ButtonIcon as={Star} className="text-amber-500" />
          </Button>
        </HStack>

        <Tabs
          value={activeSection}
          onValueChange={(value: ArenaSection) => setActiveSection(value)}
          variant="filled"
          orientation="horizontal"
          className="px-4"
        >
          <TabsList className="rounded-full">
            {SECTIONS.map((section) => (
              <TabsTrigger
                key={section}
                value={section}
                className="flex-1 rounded-full"
              >
                <TabsTriggerText className="data-[selected=true]:text-white">
                  {t(`arena.tab_${section}`)}
                </TabsTriggerText>
              </TabsTrigger>
            ))}
            <TabsIndicator className="rounded-full bg-theme" />
          </TabsList>
        </Tabs>

        {activeSection === "contests" && (
          <VStack space="lg">
            <Box className="px-4">
              <ArenaContestBanner contest={featuredContest} />
            </Box>

            <HStack space="sm" className="px-4">
              <Pressable
                onPress={handleStartQuiz}
                accessibilityRole="button"
                accessibilityLabel={t("arena.quiz_shortcut")}
                className="flex-1 items-center gap-1.5 rounded-2xl border border-border bg-card py-4 active:opacity-70"
              >
                <Icon as={HelpCircle} size="lg" className="text-theme" />
                <Text size="xs" className="font-medium text-foreground">
                  {t("arena.quiz_shortcut")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveSection("leaderboard")}
                accessibilityRole="button"
                accessibilityLabel={t("arena.leaderboard_shortcut")}
                className="flex-1 items-center gap-1.5 rounded-2xl border border-border bg-card py-4 active:opacity-70"
              >
                <Icon as={Trophy} size="lg" className="text-theme" />
                <Text size="xs" className="font-medium text-foreground">
                  {t("arena.leaderboard_shortcut")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push(ROUTES.ARENA.REWARDS)}
                accessibilityRole="button"
                accessibilityLabel={t("arena.rewards_shortcut")}
                className="flex-1 items-center gap-1.5 rounded-2xl border border-border bg-card py-4 active:opacity-70"
              >
                <Icon as={Gift} size="lg" className="text-theme" />
                <Text size="xs" className="font-medium text-foreground">
                  {t("arena.rewards_shortcut")}
                </Text>
              </Pressable>
            </HStack>

            <VStack space="xs">
              <Heading size="sm" className="px-4 text-foreground">
                {t("arena.podium_title")}
              </Heading>
              <VStack>
                {podium.map((entry) => (
                  <ArenaLeaderboardRow key={entry.id} entry={entry} />
                ))}
              </VStack>
            </VStack>

            <Tabs
              value={activeStatus}
              onValueChange={(value: ArenaContestStatus) =>
                setActiveStatus(value)
              }
              variant="underlined"
              orientation="horizontal"
              className="px-4"
            >
              <TabsList className="bg-transparent rounded-none pb-0.5">
                {STATUS_FILTERS.map((status) => (
                  <TabsTrigger key={status} value={status} className="flex-1">
                    <TabsTriggerText>
                      {t(`arena.status_${status}`)}
                    </TabsTriggerText>
                  </TabsTrigger>
                ))}
                <TabsIndicator className="border-b" />
              </TabsList>
            </Tabs>

            <VStack space="md" className="px-4">
              {filteredContests.length > 0 ? (
                filteredContests.map((contest) => (
                  <ArenaContestCard
                    key={contest.id}
                    contest={contest}
                    onPress={handleContestPress}
                  />
                ))
              ) : (
                <EmptyState
                  icon={Trophy}
                  title={t("arena.empty_title")}
                  description={t(EMPTY_DESCRIPTION_KEY[activeStatus])}
                  fullScreen={false}
                />
              )}
            </VStack>
          </VStack>
        )}

        {activeSection === "quizzes" && (
          <VStack space="md" className="px-4">
            {MOCK_ARENA_QUIZZES.length > 0 ? (
              MOCK_ARENA_QUIZZES.map((quiz) => (
                <ArenaQuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
              ))
            ) : (
              <EmptyState
                icon={HelpCircle}
                title={t("arena.empty_title")}
                description={t("arena.quizzes_empty")}
                fullScreen={false}
              />
            )}
          </VStack>
        )}

        {activeSection === "leaderboard" && (
          <VStack>
            {MOCK_ARENA_LEADERBOARD.length > 0 ? (
              MOCK_ARENA_LEADERBOARD.map((entry) => (
                <ArenaLeaderboardRow key={entry.id} entry={entry} />
              ))
            ) : (
              <EmptyState
                icon={Trophy}
                title={t("arena.empty_title")}
                description={t("arena.leaderboard_empty")}
                fullScreen={false}
              />
            )}
          </VStack>
        )}
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default ArenaScreen;
