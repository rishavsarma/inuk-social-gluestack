import { useCallback, useMemo } from "react";

import { router, useLocalSearchParams } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { getBlockById, getSettlementsForBlock } from "@/constants/mock-geo-data";
import { ROUTES } from "@/routes";

import GeoBreadcrumb from "@/components/custom/geo/GeoBreadcrumb";
import GeoMapCard from "@/components/custom/geo/GeoMapCard";
import GeoSettlementRow from "@/components/custom/geo/GeoSettlementRow";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { EmptyState } from "@/components/custom/feed/EmptyState";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const BlockScreen = () => {
  const { t } = useTranslation();
  const { blockId } = useLocalSearchParams<{ blockId: string }>();

  const block = useMemo(() => getBlockById(blockId), [blockId]);
  const settlements = useMemo(
    () => (block ? getSettlementsForBlock(block.id) : []),
    [block],
  );

  const handleSettlementPress = useCallback((settlement: GeoSettlement) => {
    router.push(ROUTES.DISCOVER.SETTLEMENT_DETAILS(settlement.id));
  }, []);

  if (!block) {
    return (
      <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">{t("geo.block_not_found")}</Text>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  return (
    <KeyboardAvoidingScrollView showBackButton alwaysShowBar title={block.name}>
      <VStack space="lg" className="pb-10">
        <VStack space="xs">
          <GeoBreadcrumb
            items={[
              {
                label: block.districtName,
                href: ROUTES.DISCOVER.DISTRICT_DETAILS(block.districtId),
              },
              { label: block.name },
            ]}
          />
          <Badge variant="outline" className="mx-4 self-start border-0 bg-muted">
            <BadgeText className="text-muted-foreground">
              {t("geo.level_block")}
            </BadgeText>
          </Badge>
        </VStack>

        <GeoMapCard label={block.name} tint="green" />

        <VStack space="sm">
          <Heading size="sm" className="px-4 text-foreground">
            {t("geo.settlements_title", { count: settlements.length })}
          </Heading>
          <VStack space="sm" className="px-4">
            {settlements.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title={t("geo.empty_settlements_title")}
                description={t("geo.empty_settlements_description")}
                fullScreen={false}
              />
            ) : (
              settlements.map((settlement) => (
                <GeoSettlementRow
                  key={settlement.id}
                  settlement={settlement}
                  onPress={handleSettlementPress}
                />
              ))
            )}
          </VStack>
        </VStack>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default BlockScreen;
