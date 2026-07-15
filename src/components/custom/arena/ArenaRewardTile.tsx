import React from "react";

import { Gift, Star } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

import { ImagePlaceholder } from "@/components/custom/ImagePlaceholder";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface ArenaRewardTileProps {
  reward: ArenaReward;
  canAfford: boolean;
  redeemed: boolean;
  onRedeem: (reward: ArenaReward) => void;
}

function ArenaRewardTile({
  reward,
  canAfford,
  redeemed,
  onRedeem,
}: ArenaRewardTileProps) {
  const { t } = useTranslation();
  const tint = POST_METADATA_TINTS[reward.tint];

  return (
    <Card className="flex-1 gap-2 rounded-2xl p-0">
      <ImagePlaceholder
        icon={Gift}
        tint={reward.tint}
        className="h-20 w-full rounded-t-2xl"
      />
      <VStack space="xs" className="px-3 pb-3">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {reward.title}
        </Text>
        <HStack space="xs" className="items-center">
          <Icon as={Star} size="xs" className={tint.iconColorFilled} />
          <Text className="text-xs text-muted-foreground">{reward.cost}</Text>
        </HStack>
        <Button
          size="sm"
          variant={redeemed ? "outline" : "theme"}
          disabled={redeemed || !canAfford}
          onPress={() => onRedeem(reward)}
          accessibilityRole="button"
          accessibilityLabel={t("rewards.redeem_a11y", {
            title: reward.title,
            cost: reward.cost,
          })}
          className="rounded-full"
        >
          <ButtonText className={redeemed ? "" : "text-white"}>
            {redeemed
              ? t("rewards.redeemed")
              : t("rewards.redeem_button", { cost: reward.cost })}
          </ButtonText>
        </Button>
      </VStack>
    </Card>
  );
}

export default React.memo(ArenaRewardTile);
