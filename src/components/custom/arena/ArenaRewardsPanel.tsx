import React, { useCallback, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import ArenaRewardTile from "@/components/custom/arena/ArenaRewardTile";
import ArenaWinningRow from "@/components/custom/arena/ArenaWinningRow";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { MIN_REDEEMABLE_SPARKS } from "@/constants";
import { ARENA_REWARDS, MOCK_ARENA_WINNINGS } from "@/constants/mock-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND, WEB_PALETTE, WEB_TEXT_SUB } from "@/constants/web-reference-theme";
import { useWalletStore } from "@/stores/wallet.store";
import { formatCompactNumber } from "@/utils/formatNumber";

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return rows;
}

function ArenaRewardsPanel() {
  const { t } = useTranslation();
  const points = useWalletStore((state) => state.points);
  const transactions = useWalletStore((state) => state.transactions);
  const addPoints = useWalletStore((state) => state.addPoints);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const lifetimeEarned = useMemo(
    () => transactions.filter((txn) => txn.amount > 0).reduce((sum, txn) => sum + txn.amount, 0),
    [transactions],
  );

  const handleClaim = useCallback(
    (winning: ArenaWinning) => {
      addPoints(winning.sparksValue, "sparks.txn_winning_claim");
      setClaimedIds((prev) => new Set(prev).add(winning.id));
    },
    [addPoints],
  );

  return (
    <VStack>
      <Box style={{ backgroundColor: WEB_PALETTE.red }} className="mx-3.5 mt-3.5 rounded-2xl p-4">
        <Text className={`${WEB_FONT_BODY[400]} text-[11px] tracking-[0.5px] text-white opacity-90`}>
          ★ SPARKS BALANCE
        </Text>
        <Text className={`${WEB_FONT_ROUND[800]} text-[30px] text-white`}>{formatCompactNumber(points)}</Text>
        <Text className={`${WEB_FONT_BODY[400]} text-[11.5px] text-white opacity-90`}>
          {t("rewards.redeemable", { count: MIN_REDEEMABLE_SPARKS })} · {t("rewards.lifetime_never_spent", { count: lifetimeEarned })}
        </Text>
      </Box>

      <SectionTitle>REDEEM</SectionTitle>
      <VStack className="gap-2.5 px-3.5">
        {chunkPairs(ARENA_REWARDS).map((row, rowIndex) => (
          <Box key={rowIndex} className="flex-row gap-2.5">
            {row.map((reward) => (
              <ArenaRewardTile key={reward.name} reward={reward} />
            ))}
            {row.length === 1 && <Box className="flex-1" />}
          </Box>
        ))}
      </VStack>

      <SectionTitle>YOUR WINNINGS</SectionTitle>
      {MOCK_ARENA_WINNINGS.length > 0 ? (
        <VStack className="gap-2.5">
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
        <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} px-4.5 text-sm`}>
          {t("rewards.empty_winnings")}
        </Text>
      )}
    </VStack>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mb-2.5 mt-4.5 px-4.5 text-[13px]`}>
      {children}
    </Text>
  );
}

export default React.memo(ArenaRewardsPanel);
