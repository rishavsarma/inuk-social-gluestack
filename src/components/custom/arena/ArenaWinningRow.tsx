import React from "react";

import { Star } from "lucide-react-native";
import { useColorScheme } from "react-native";

import { useTranslation } from "react-i18next";

import ArenaRowShell from "@/components/custom/arena/ArenaRowShell";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

import { WEB_FONT_ROUND, WEB_PALETTE } from "@/constants/web-reference-theme";

interface ArenaWinningRowProps {
  winning: ArenaWinning;
  claimed: boolean;
  onClaim: (winning: ArenaWinning) => void;
}

function ArenaWinningRow({ winning, claimed, onClaim }: ArenaWinningRowProps) {
  const { t } = useTranslation();
  const isDark = useColorScheme() === "dark";

  return (
    <ArenaRowShell
      className="mx-4 p-3"
      leading={
        <Box
          style={{ backgroundColor: WEB_PALETTE.red }}
          className="h-9 w-9 items-center justify-center rounded-[10px]"
        >
          <Icon as={Star} size="sm" className="text-white" />
        </Box>
      }
      trailing={
        <Pressable
          onPress={() => onClaim(winning)}
          accessibilityRole="button"
          accessibilityLabel={t("rewards.claim_a11y", { label: winning.label })}
          style={{ backgroundColor: WEB_PALETTE.red }}
          className="rounded-2xl px-4 py-2"
        >
          <Text className={`${WEB_FONT_ROUND[700]} text-xs text-white`}>
            {claimed ? t("rewards.claimed") : t("rewards.claim")}
          </Text>
        </Pressable>
      }
    >
      <Text className={`${WEB_FONT_ROUND[700]} flex-1 text-sm ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
        {winning.label} · {winning.amountLabel}
      </Text>
    </ArenaRowShell>
  );
}

export default React.memo(ArenaWinningRow);
