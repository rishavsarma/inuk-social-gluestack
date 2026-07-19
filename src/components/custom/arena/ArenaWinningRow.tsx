import React from "react";

import { Star } from "lucide-react-native";
import { useColorScheme } from "react-native";

import { useTranslation } from "react-i18next";

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
    <Box
      style={{ borderColor: isDark ? "#2b3050" : "#E3E4EC" }}
      className="mx-3.5 flex-row items-center gap-2.75 rounded-field border p-3"
    >
      <Box style={{ backgroundColor: WEB_PALETTE.red }} className="h-9 w-9 items-center justify-center rounded-[10px]">
        <Icon as={Star} size="sm" className="text-white" />
      </Box>
      <Text className={`${WEB_FONT_ROUND[700]} flex-1 text-[13.5px] ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
        {winning.label} · {winning.amountLabel}
      </Text>
      <Pressable
        onPress={() => onClaim(winning)}
        accessibilityRole="button"
        accessibilityLabel={t("rewards.claim_a11y", { label: winning.label })}
        style={{ backgroundColor: WEB_PALETTE.red }}
        className="rounded-2xl px-3.5 py-1.75"
      >
        <Text className={`${WEB_FONT_ROUND[700]} text-[12.5px] text-white`}>
          {claimed ? t("rewards.claimed") : t("rewards.claim")}
        </Text>
      </Pressable>
    </Box>
  );
}

export default React.memo(ArenaWinningRow);
