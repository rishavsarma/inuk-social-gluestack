import { useCallback, useMemo } from "react";

import { router, useLocalSearchParams } from "expo-router";
import { MapPin, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import {
  getBlockById,
  getDistrictById,
  getLocalityById,
  getPoisForLocality,
  getSettlementById,
} from "@/constants/mock-geo-data";
import { ROUTES } from "@/routes";

import GeoBreadcrumb from "@/components/custom/geo/GeoBreadcrumb";
import GeoMapCard from "@/components/custom/geo/GeoMapCard";
import GeoPoiRow from "@/components/custom/geo/GeoPoiRow";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { EmptyState } from "@/components/custom/feed/EmptyState";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

const LocalityScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { localityId } = useLocalSearchParams<{ localityId: string }>();

  const locality = useMemo(() => getLocalityById(localityId), [localityId]);
  const settlement = useMemo(
    () => (locality ? getSettlementById(locality.settlementId) : undefined),
    [locality],
  );
  const block = useMemo(
    () => (settlement ? getBlockById(settlement.blockId) : undefined),
    [settlement],
  );
  const district = useMemo(
    () => (block ? getDistrictById(block.districtId) : undefined),
    [block],
  );
  const pois = useMemo(
    () => (locality ? getPoisForLocality(locality.id) : []),
    [locality],
  );

  const handlePoiPress = useCallback((poi: GeoPoi) => {
    router.push(ROUTES.DISCOVER.POI_DETAILS(poi.id));
  }, []);

  const handleAddPlacePress = useCallback(() => {
    toast.show({
      placement: "bottom",
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
          <ToastDescription>{t("discover.coming_soon")}</ToastDescription>
        </Toast>
      ),
    });
  }, [t, toast]);

  if (!locality || !settlement || !block || !district) {
    return (
      <KeyboardAvoidingScrollView showBackButton alwaysShowBar>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground">
            {t("geo.locality_not_found")}
          </Text>
        </VStack>
      </KeyboardAvoidingScrollView>
    );
  }

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={locality.name}
    >
      <VStack space="lg" className="pb-10">
        <VStack space="xs">
          <GeoBreadcrumb
            items={[
              {
                label: district.name,
                href: ROUTES.DISCOVER.DISTRICT_DETAILS(district.id),
              },
              {
                label: block.name,
                href: ROUTES.DISCOVER.BLOCK_DETAILS(block.id),
              },
              {
                label: settlement.name,
                href: ROUTES.DISCOVER.SETTLEMENT_DETAILS(settlement.id),
              },
              { label: locality.name },
            ]}
          />
          <Badge variant="outline" className="mx-4 self-start border-0 bg-muted">
            <BadgeText className="text-muted-foreground">
              {t("geo.locality_badge")}
            </BadgeText>
          </Badge>
        </VStack>

        <GeoMapCard label={locality.name} tint="green" />

        <VStack space="sm">
          <Heading size="sm" className="px-4 text-foreground">
            {t("geo.pois_title")}
          </Heading>
          <VStack space="sm" className="px-4">
            {pois.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title={t("geo.empty_pois_title")}
                description={t("geo.empty_pois_description")}
                fullScreen={false}
              />
            ) : (
              pois.map((poi) => (
                <GeoPoiRow key={poi.id} poi={poi} onPress={handlePoiPress} />
              ))
            )}
          </VStack>
        </VStack>

        <Box className="px-4">
          <Button
            variant="theme"
            onPress={handleAddPlacePress}
            accessibilityRole="button"
            accessibilityLabel={t("geo.add_place_cta_a11y", {
              locality: locality.name,
            })}
            className="rounded-full"
          >
            <ButtonIcon as={Plus} className="text-white" />
            <ButtonText className="text-white">
              {t("geo.add_place_cta")}
            </ButtonText>
          </Button>
        </Box>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default LocalityScreen;
