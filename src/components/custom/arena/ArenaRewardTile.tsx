import React, { useCallback } from "react";

import { useColorScheme } from "react-native";

import { useTranslation } from "react-i18next";

import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";

import { useWalletStore } from "@/stores/wallet.store";

import { WEB_BORDER_LINE, WEB_FONT_ROUND, WEB_PALETTE } from "@/constants/web-reference-theme";

interface ArenaRewardTileProps {
  reward: WebArenaReward;
}

function ArenaRewardTile({ reward }: ArenaRewardTileProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const isDark = useColorScheme() === "dark";
  const spendPoints = useWalletStore((state) => state.spendPoints);

  const handlePress = useCallback(() => {
    const success = spendPoints(reward.pts, "sparks.txn_reward_redeem");
    if (!success) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
            <ToastDescription>{t("rewards.not_enough_sparks")}</ToastDescription>
          </Toast>
        ),
      });
    }
  }, [reward.pts, spendPoints, t, toast]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={reward.name}
      className={`flex-1 overflow-hidden rounded-field border ${WEB_BORDER_LINE}`}
    >
      <Box style={{ backgroundColor: reward.col }} className="h-14.5" />
      <Box className="p-3">
        <Text className={`${WEB_FONT_ROUND[700]} text-sm ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
          {reward.name}
        </Text>
        <Text style={{ color: WEB_PALETTE.red }} className={`${WEB_FONT_ROUND[700]} mt-1 text-xs`}>
          ★ {reward.pts}
        </Text>
      </Box>
    </Pressable>
  );
}

export default React.memo(ArenaRewardTile);
