import React from "react";

import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { GEO_SETTLEMENT_ICONS } from "@/constants/geo-poi-categories";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface GeoSettlementRowProps {
  settlement: GeoSettlement;
  onPress: (settlement: GeoSettlement) => void;
}

function GeoSettlementRow({ settlement, onPress }: GeoSettlementRowProps) {
  const { t } = useTranslation();
  const SettlementIcon = GEO_SETTLEMENT_ICONS[settlement.kind];

  return (
    <Pressable
      onPress={() => onPress(settlement)}
      accessibilityRole="button"
      accessibilityLabel={t("geo.open_settlement_a11y", {
        name: settlement.name,
      })}
      className="active:opacity-80"
    >
      <HStack
        space="md"
        className="items-center rounded-2xl border border-border bg-card px-4 py-3"
      >
        <Box className="h-10 w-10 items-center justify-center rounded-xl bg-muted">
          <Icon as={SettlementIcon} size="md" className="text-theme" />
        </Box>
        <VStack className="flex-1">
          <HStack space="xs" className="items-center">
            <Heading size="sm" className="text-foreground" numberOfLines={1}>
              {settlement.name}
            </Heading>
            <Badge variant="outline" className="border-0 bg-muted px-1.5 py-0">
              <BadgeText className="text-[10px] text-muted-foreground">
                {t(`geo.settlement_kind_${settlement.kind.toLowerCase()}`)}
              </BadgeText>
            </Badge>
          </HStack>
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {t("discover.posts_count", { count: settlement.postsCount })}
          </Text>
        </VStack>
        <Icon as={ChevronRight} size="sm" className="text-muted-foreground" />
      </HStack>
    </Pressable>
  );
}

export default React.memo(GeoSettlementRow);
