import React from "react";

import { Trophy } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface ArenaWinningRowProps {
  winning: ArenaWinning;
  claimed: boolean;
  onClaim: (winning: ArenaWinning) => void;
}

function ArenaWinningRow({ winning, claimed, onClaim }: ArenaWinningRowProps) {
  const { t } = useTranslation();

  return (
    <HStack
      space="md"
      className="items-center rounded-xl border border-border bg-card px-4 py-3"
    >
      <Box
        className={`h-10 w-10 items-center justify-center rounded-full ${POST_METADATA_TINTS.amber.iconBg}`}
      >
        <Icon
          as={Trophy}
          size="md"
          className={POST_METADATA_TINTS.amber.iconColor}
        />
      </Box>
      <VStack className="flex-1">
        <Text className="text-sm font-semibold text-foreground">
          {winning.label}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {winning.amountLabel}
        </Text>
      </VStack>
      <Button
        size="sm"
        variant={claimed ? "outline" : "theme"}
        disabled={claimed}
        onPress={() => onClaim(winning)}
        accessibilityRole="button"
        accessibilityLabel={t("rewards.claim_a11y", { label: winning.label })}
        className="rounded-full"
      >
        <ButtonText className={claimed ? "" : "text-white"}>
          {claimed ? t("rewards.claimed") : t("rewards.claim")}
        </ButtonText>
      </Button>
    </HStack>
  );
}

export default React.memo(ArenaWinningRow);
