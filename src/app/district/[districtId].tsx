import { useCallback, useMemo } from "react";

import { router, useLocalSearchParams } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import {
  getBlocksForDistrict,
  getDistrictById,
  getPoisCountForBlock,
  getPoisCountForDistrict,
  getSettlementsForBlock,
} from "@/constants/mock-geo-data";
import { ROUTES } from "@/routes";

import GeoBreadcrumb from "@/components/custom/geo/GeoBreadcrumb";
import GeoChildRow from "@/components/custom/geo/GeoChildRow";
import GeoMapCard from "@/components/custom/geo/GeoMapCard";
import GeoStatRow from "@/components/custom/geo/GeoStatRow";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { EmptyState } from "@/components/custom/feed/EmptyState";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const DistrictScreen = () => {
  const { t } = useTranslation();
  const { districtId } = useLocalSearchParams<{ districtId: string }>();

  const district = useMemo(() => getDistrictById(districtId), [districtId]);
  const blocks = useMemo(
    () => (district ? getBlocksForDistrict(district.id) : []),
    [district],
  );
  const poisCount = useMemo(
    () => (district ? getPoisCountForDistrict(district.id) : 0),
    [district],
  );

  const handleBlockPress = useCallback((block: GeoBlock) => {
    router.push(ROUTES.DISCOVER.BLOCK_DETAILS(block.id));
  }, []);

  if (!district) {
    return (
      <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">
            {t("geo.district_not_found")}
          </Text>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={district.name}
    >
      <VStack space="lg" className="pb-10">
        <VStack space="xs">
          <GeoBreadcrumb
            items={[
              {
                label: district.regionName,
                href: ROUTES.DISCOVER.REGION_DETAILS(district.regionId),
              },
              { label: district.name },
            ]}
          />
          <Badge variant="outline" className="mx-4 self-start border-0 bg-muted">
            <BadgeText className="text-muted-foreground">
              {t("geo.level_district")}
            </BadgeText>
          </Badge>
        </VStack>

        <GeoMapCard label={district.name} tint="green" />

        <GeoStatRow
          stats={[
            { value: district.postsCount, label: t("place.posts_stat") },
            { value: blocks.length, label: t("geo.blocks_stat") },
            { value: poisCount, label: t("geo.pois_stat") },
          ]}
        />

        <VStack space="sm">
          <Heading size="sm" className="px-4 text-foreground">
            {t("geo.blocks_title", { count: blocks.length })}
          </Heading>
          <VStack space="sm" className="px-4">
            {blocks.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title={t("geo.empty_blocks_title")}
                description={t("geo.empty_blocks_description")}
                fullScreen={false}
              />
            ) : (
              blocks.map((block) => (
                <GeoChildRow
                  key={block.id}
                  name={block.name}
                  subtitle={t("geo.block_row_subtitle", {
                    settlements: getSettlementsForBlock(block.id).length,
                    pois: getPoisCountForBlock(block.id),
                  })}
                  onPress={() => handleBlockPress(block)}
                  accessibilityLabel={t("geo.open_block_a11y", {
                    name: block.name,
                  })}
                />
              ))
            )}
          </VStack>
        </VStack>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default DistrictScreen;
