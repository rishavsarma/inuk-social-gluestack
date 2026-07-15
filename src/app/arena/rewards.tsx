import { useCallback, useMemo, useState } from "react";

import { Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import ArenaRewardTile from "@/components/custom/arena/ArenaRewardTile";
import ArenaWinningRow from "@/components/custom/arena/ArenaWinningRow";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { MIN_REDEEMABLE_SPARKS } from "@/constants";
import { MOCK_ARENA_REWARDS, MOCK_ARENA_WINNINGS } from "@/constants/mock-data";
import { useWalletStore } from "@/stores/wallet.store";
import { formatCompactNumber } from "@/utils/formatNumber";

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return rows;
}

const RewardsScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const points = useWalletStore((state) => state.points);
  const transactions = useWalletStore((state) => state.transactions);
  const spendPoints = useWalletStore((state) => state.spendPoints);
  const addPoints = useWalletStore((state) => state.addPoints);

  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(new Set());
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const lifetimeEarned = useMemo(
    () =>
      transactions
        .filter((txn) => txn.amount > 0)
        .reduce((sum, txn) => sum + txn.amount, 0),
    [transactions],
  );

  const handleRedeem = useCallback(
    (reward: ArenaReward) => {
      if (redeemedIds.has(reward.id)) return;
      const success = spendPoints(reward.cost, "sparks.txn_reward_redeem");
      if (success) {
        setRedeemedIds((prev) => new Set(prev).add(reward.id));
        return;
      }
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
            <ToastDescription>{t("rewards.not_enough_sparks")}</ToastDescription>
          </Toast>
        ),
      });
    },
    [redeemedIds, spendPoints, t, toast],
  );

  const handleClaim = useCallback(
    (winning: ArenaWinning) => {
      if (claimedIds.has(winning.id)) return;
      addPoints(winning.sparksValue, "sparks.txn_winning_claim");
      setClaimedIds((prev) => new Set(prev).add(winning.id));
    },
    [addPoints, claimedIds],
  );

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("rewards.title")}
    >
      <VStack space="lg" className="px-4 pb-10">
        <Card className="items-center gap-1 rounded-2xl bg-theme p-6">
          <HStack space="xs" className="items-center">
            <Icon as={Sparkles} size="sm" className="text-white/80" />
            <Text className="text-sm font-semibold text-white/80">
              {t("rewards.sparks_balance")}
            </Text>
          </HStack>
          <Text className="text-4xl font-bold text-white">
            {formatCompactNumber(points)}
          </Text>
          <Text className="text-xs text-white/70">
            {t("rewards.redeemable", { count: MIN_REDEEMABLE_SPARKS })}
            {" · "}
            {t("rewards.lifetime_never_spent", { count: lifetimeEarned })}
          </Text>
        </Card>

        <VStack space="sm">
          <Heading size="sm" className="text-foreground">
            {t("rewards.redeem_section")}
          </Heading>
          <VStack space="sm">
            {chunkPairs(MOCK_ARENA_REWARDS).map((row, rowIndex) => (
              <HStack key={rowIndex} space="sm">
                {row.map((reward) => (
                  <ArenaRewardTile
                    key={reward.id}
                    reward={reward}
                    canAfford={points >= reward.cost}
                    redeemed={redeemedIds.has(reward.id)}
                    onRedeem={handleRedeem}
                  />
                ))}
                {row.length === 1 && <Box className="flex-1" />}
              </HStack>
            ))}
          </VStack>
        </VStack>

        <VStack space="sm">
          <Heading size="sm" className="text-foreground">
            {t("rewards.your_winnings")}
          </Heading>
          {MOCK_ARENA_WINNINGS.length > 0 ? (
            <VStack space="sm">
              {MOCK_ARENA_WINNINGS.map((winning) => (
                <ArenaWinningRow
                  key={winning.id}
                  winning={winning}
                  claimed={claimedIds.has(winning.id)}
                  onClaim={handleClaim}
                />
              ))}
            </VStack>
          ) : (
            <Text className="text-sm text-muted-foreground">
              {t("rewards.empty_winnings")}
            </Text>
          )}
        </VStack>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default RewardsScreen;
