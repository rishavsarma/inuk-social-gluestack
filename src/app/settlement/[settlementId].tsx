import { useCallback, useMemo } from "react";

import { router, useLocalSearchParams } from "expo-router";
import { MapPin } from "lucide-react-native";
import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import {
  getLocalitiesForSettlement,
  getPoisForSettlement,
  getSettlementById,
} from "@/constants/mock-geo-data";
import { GEO_SETTLEMENT_TINTS } from "@/constants/geo-poi-categories";
import { ROUTES } from "@/routes";

import GeoChildRow from "@/components/custom/geo/GeoChildRow";
import GeoCoverageBar from "@/components/custom/geo/GeoCoverageBar";
import GeoCoverHero from "@/components/custom/geo/GeoCoverHero";
import GeoPoiTile from "@/components/custom/geo/GeoPoiTile";
import GeoStatRow from "@/components/custom/geo/GeoStatRow";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { EmptyState } from "@/components/custom/feed/EmptyState";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const SettlementScreen = () => {
  const { t } = useTranslation();
  const { settlementId } = useLocalSearchParams<{ settlementId: string }>();

  const settlement = useMemo(
    () => getSettlementById(settlementId),
    [settlementId],
  );
  const localities = useMemo(
    () => (settlement ? getLocalitiesForSettlement(settlement.id) : []),
    [settlement],
  );
  const pois = useMemo(
    () => (settlement ? getPoisForSettlement(settlement.id) : []),
    [settlement],
  );
  const notablePois = useMemo(
    () =>
      [...pois]
        .sort((a, b) => Number(b.touristWorthy) - Number(a.touristWorthy))
        .slice(0, 3),
    [pois],
  );

  const handleLocalityPress = useCallback((locality: GeoLocality) => {
    router.push(ROUTES.DISCOVER.LOCALITY_DETAILS(locality.id));
  }, []);

  const handlePoiPress = useCallback((poi: GeoPoi) => {
    router.push(ROUTES.DISCOVER.POI_DETAILS(poi.id));
  }, []);

  if (!settlement) {
    return (
      <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">
            {t("geo.settlement_not_found")}
          </Text>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={settlement.name}
    >
      <VStack space="lg" className="pb-10">
        <GeoCoverHero
          title={settlement.name}
          subtitle={`${settlement.blockName} · ${settlement.districtName} · ${settlement.regionName}`}
          badgeLabel={t(`geo.settlement_kind_${settlement.kind.toLowerCase()}`)}
          tint={GEO_SETTLEMENT_TINTS[settlement.kind]}
        />

        <GeoCoverageBar percent={settlement.coveragePercent} />

        <GeoStatRow
          stats={[
            { value: settlement.postsCount, label: t("place.posts_stat") },
            {
              value: settlement.contributorsCount,
              label: t("place.contributors_stat"),
            },
            { value: pois.length, label: t("geo.pois_stat") },
          ]}
        />

        <VStack space="sm">
          <Heading size="sm" className="px-4 text-foreground">
            {t("geo.localities_title")}
          </Heading>
          <VStack space="sm" className="px-4">
            {localities.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title={t("geo.empty_localities_title")}
                description={t("geo.empty_localities_description")}
                fullScreen={false}
              />
            ) : (
              localities.map((locality) => (
                <GeoChildRow
                  key={locality.id}
                  name={locality.name}
                  subtitle={t("geo.locality_row_subtitle", {
                    count: getPoisForLocalityCount(locality.id, pois),
                  })}
                  badgeLabel={t("geo.locality_kind")}
                  onPress={() => handleLocalityPress(locality)}
                  accessibilityLabel={t("geo.open_locality_a11y", {
                    name: locality.name,
                  })}
                />
              ))
            )}
          </VStack>
        </VStack>

        {notablePois.length > 0 && (
          <VStack space="sm">
            <Heading size="sm" className="px-4 text-foreground">
              {t("geo.notable_places_title")}
            </Heading>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
            >
              {notablePois.map((poi) => (
                <GeoPoiTile key={poi.id} poi={poi} onPress={handlePoiPress} />
              ))}
            </ScrollView>
          </VStack>
        )}
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

function getPoisForLocalityCount(localityId: string, pois: GeoPoi[]) {
  return pois.filter((poi) => poi.localityId === localityId).length;
}

export default SettlementScreen;
