import { useCallback, useMemo } from "react";

import { router, useLocalSearchParams } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { getDistrictsForRegion, getRegionById } from "@/constants/mock-geo-data";
import { ROUTES } from "@/routes";

import GeoBreadcrumb from "@/components/custom/geo/GeoBreadcrumb";
import GeoChildRow from "@/components/custom/geo/GeoChildRow";
import GeoCoverageBar from "@/components/custom/geo/GeoCoverageBar";
import GeoMapCard from "@/components/custom/geo/GeoMapCard";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { EmptyState } from "@/components/custom/feed/EmptyState";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const RegionScreen = () => {
  const { t } = useTranslation();
  const { regionId } = useLocalSearchParams<{ regionId: string }>();

  const region = useMemo(() => getRegionById(regionId), [regionId]);
  const districts = useMemo(
    () => (region ? getDistrictsForRegion(region.id) : []),
    [region],
  );

  const handleDistrictPress = useCallback((district: GeoDistrict) => {
    router.push(ROUTES.DISCOVER.DISTRICT_DETAILS(district.id));
  }, []);

  if (!region) {
    return (
      <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">{t("geo.region_not_found")}</Text>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  return (
    <KeyboardAvoidingScrollView showBackButton alwaysShowBar title={region.name}>
      <VStack space="lg" className="pb-10">
        <VStack space="xs">
          <GeoBreadcrumb
            items={[
              { label: region.parentLabel },
              { label: region.name },
            ]}
          />
          <Badge variant="outline" className="mx-4 self-start border-0 bg-muted">
            <BadgeText className="text-muted-foreground">
              {t("geo.level_region")}
            </BadgeText>
          </Badge>
        </VStack>

        <GeoMapCard label={region.name} tint="green" />

        <GeoCoverageBar percent={region.coveragePercent} />

        <VStack space="sm">
          <Heading size="sm" className="px-4 text-foreground">
            {t("geo.districts_title", { count: districts.length })}
          </Heading>
          <VStack space="sm" className="px-4">
            {districts.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title={t("geo.empty_districts_title")}
                description={t("geo.empty_districts_description")}
                fullScreen={false}
              />
            ) : (
              districts.map((district) => (
                <GeoChildRow
                  key={district.id}
                  name={district.name}
                  subtitle={t("geo.district_row_subtitle", {
                    posts: district.postsCount,
                    percent: district.coveragePercent,
                  })}
                  onPress={() => handleDistrictPress(district)}
                  accessibilityLabel={t("geo.open_district_a11y", {
                    name: district.name,
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

export default RegionScreen;
