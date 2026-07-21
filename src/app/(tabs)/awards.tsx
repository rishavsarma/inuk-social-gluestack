import { useMemo } from "react";

import { Href, router } from "expo-router";

import { ChevronRight, Sparkles, Trophy } from "lucide-react-native";
import { useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";

import ArenaLeaderboardRow from "@/components/custom/arena/ArenaLeaderboardRow";
import SuggestedProfileCard from "@/components/custom/profile/SuggestedProfileCard";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";

import { useTimeAgo } from "@/hooks/useTimeAgo";
import { useWalletStore, type SparkTransactionItem } from "@/stores/wallet.store";

import { ARENA_PODIUM, MOCK_SEARCH_PROFILES } from "@/constants/mock-data";
import {
  WEB_FONT_BODY,
  WEB_FONT_ROUND,
  WEB_PALETTE,
  WEB_TEXT_INK,
  WEB_TEXT_SUB,
} from "@/constants/web-reference-theme";
import { ROUTES } from "@/routes";
import { formatCompactNumber } from "@/utils/formatNumber";

const RECENT_TXN_COUNT = 5;
const TOP_CREATOR_COUNT = 6;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mb-2.5 mt-5 px-4.5 text-[13px] uppercase tracking-[0.5px]`}>
      {children}
    </Text>
  );
}

function ActivityRow({ item }: { item: SparkTransactionItem }) {
  const { t } = useTranslation();
  const isDark = useColorScheme() === "dark";
  const timeAgo = useTimeAgo(item.timestamp);
  const isEarned = item.amount >= 0;

  return (
    <Box
      style={{ borderColor: isDark ? "#2b3050" : "#E3E4EC" }}
      className="mx-3.5 mb-2.25 flex-row items-center gap-2.75 rounded-field border p-2.75"
    >
      <Box
        style={{ backgroundColor: isEarned ? "#2E7D32" : WEB_PALETTE.red }}
        className="h-8 w-8 items-center justify-center rounded-[10px]"
      >
        <Icon as={Sparkles} size="sm" className="text-white" />
      </Box>
      <VStack className="flex-1">
        <Text className={`${WEB_FONT_ROUND[700]} text-[13.5px] ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
          {t(item.reasonKey)}
        </Text>
        <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-[11.5px]`}>{timeAgo}</Text>
      </VStack>
      <Text
        style={{ color: isEarned ? "#2E7D32" : WEB_PALETTE.red }}
        className={`${WEB_FONT_ROUND[700]} text-[13.5px]`}
      >
        {isEarned ? `+${item.amount}` : `${item.amount}`}
      </Text>
    </Box>
  );
}

const AwardScreen = () => {
  const { t } = useTranslation();
  const isDark = useColorScheme() === "dark";

  const points = useWalletStore((state) => state.points);
  const transactions = useWalletStore((state) => state.transactions);

  const recentTransactions = useMemo(
    () => transactions.slice(0, RECENT_TXN_COUNT),
    [transactions],
  );

  const topCreators = useMemo(
    () => MOCK_SEARCH_PROFILES.slice(0, TOP_CREATOR_COUNT),
    [],
  );

  const bg = isDark ? "#12142A" : "#FFFFFF";

  return (
    <View className="flex-1" style={{ backgroundColor: bg }}>
      <Box className="flex-row items-center justify-between px-4.5 pb-2 pt-13">
        <Text className={`${WEB_FONT_ROUND[800]} ${WEB_TEXT_INK} text-[27px]`}>
          {t("awards.title")}
        </Text>
        <Icon as={Trophy} size="lg" style={{ color: "#E6B325" }} />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <Pressable
          onPress={() => router.push(ROUTES.USER.POINTS as Href)}
          accessibilityRole="button"
          accessibilityLabel={t("sparks.inuk_balance")}
          style={{ backgroundColor: WEB_PALETTE.red }}
          className="mx-3.5 mt-2 rounded-2xl p-4"
        >
          <Text className={`${WEB_FONT_BODY[400]} text-[11px] uppercase tracking-[0.5px] text-white opacity-90`}>
            ★ {t("sparks.inuk_balance")}
          </Text>
          <Text className={`${WEB_FONT_ROUND[800]} text-[30px] text-white`}>
            {formatCompactNumber(points)}
          </Text>
          <Box className="flex-row items-center gap-0.5">
            <Text className={`${WEB_FONT_ROUND[700]} text-[12.5px] text-white`}>
              {t("awards.view_all")}
            </Text>
            <Icon as={ChevronRight} size="xs" className="text-white" />
          </Box>
        </Pressable>

        <SectionTitle>{t("awards.this_weeks_podium")}</SectionTitle>
        <Box className="px-3.5">
          {ARENA_PODIUM.map((entry) => (
            <ArenaLeaderboardRow key={entry.rank} entry={entry} />
          ))}
        </Box>

        <SectionTitle>{t("awards.top_creators")}</SectionTitle>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14, gap: 10 }}
        >
          {topCreators.map((profile) => (
            <SuggestedProfileCard key={profile.id} profile={profile} />
          ))}
        </ScrollView>

        <SectionTitle>{t("awards.recent_activity")}</SectionTitle>
        {recentTransactions.length > 0 ? (
          <VStack>
            {recentTransactions.map((txn) => (
              <ActivityRow key={txn.id} item={txn} />
            ))}
          </VStack>
        ) : (
          <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} px-4.5 text-sm`}>
            {t("sparks.no_history")}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default AwardScreen;
