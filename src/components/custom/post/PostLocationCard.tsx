import * as React from "react";

import {
  Building2,
  CalendarDaysIcon,
  Landmark,
  MapIcon,
  MapPinIcon,
  Mountain,
  PlaneIcon,
  RouteIcon,
  Sparkles,
  TrainFrontIcon,
  TreePineIcon,
  Users,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";
import { formatCompactNumber } from "@/utils/formatNumber";

import { MapTile } from "./PostEnvironmentCard";

export interface PostLocationCardProps {
  location: LocationDetail;
}

interface LocationItemProps {
  icon: React.ComponentType<any>;
  tint: keyof typeof POST_METADATA_TINTS;
  label: string;
  value: string;
}

const LocationItem = React.memo(function LocationItem({
  icon,
  tint,
  label,
  value,
}: LocationItemProps) {
  const style = POST_METADATA_TINTS[tint];
  return (
    <HStack className="flex-1 flex-row items-center gap-3 overflow-hidden">
      <Box
        className={`p-2.5 items-center justify-center rounded-lg ${style.iconBg}`}
      >
        <Icon as={icon} size="sm" className={style.iconColor} />
      </Box>
      <VStack>
        <Text
          className="text-xs text-foreground/50 font-medium"
          numberOfLines={1}
        >
          {label}
        </Text>
        <Text
          className="text-sm truncate  font-bold text-foreground"
          numberOfLines={1}
          isTruncated
          adjustsFontSizeToFit
        >
          {value}
        </Text>
      </VStack>
    </HStack>
  );
});

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const PostLocationCard = React.memo(function PostLocationCard({
  location,
}: PostLocationCardProps) {
  const { t } = useTranslation();

  const items: LocationItemProps[] = [];

  items.push({
    icon: MapPinIcon,
    tint: "rose",
    label: t("post_detail.location"),
    value: location.name,
  });

  if (location.breadcrumb) {
    items.push({
      icon: MapIcon,
      tint: "violet",
      label: t("post_detail.region"),
      value: location.breadcrumb,
    });
  }

  if (location.settlementClass || location.type) {
    items.push({
      icon: Building2,
      tint: "sky",
      label: t("post_detail.type"),
      value: titleCase(location.settlementClass || location.type),
    });
  }

  if (location.ruralUrban) {
    items.push({
      icon: TreePineIcon,
      tint: "green",
      label: t("post_detail.area_type"),
      value:
        location.ruralUrban === "RURAL"
          ? t("post_detail.rural")
          : t("post_detail.urban"),
    });
  }

  if (location.population) {
    items.push({
      icon: Users,
      tint: "blue",
      label: t("post_detail.population"),
      value: formatCompactNumber(location.population),
    });
  }

  if (location.elevationMinM || location.elevationMaxM) {
    const min = location.elevationMinM;
    const max = location.elevationMaxM;
    const value =
      min && max && min !== max
        ? t("post_detail.elevation_range", { min, max })
        : t("post_detail.elevation_value", { value: max ?? min });
    items.push({
      icon: Mountain,
      tint: "emerald",
      label: t("post_detail.elevation"),
      value,
    });
  }

  if (location.isTouristSpot) {
    items.push({
      icon: Sparkles,
      tint: "amber",
      label: t("post_detail.tourist_spot"),
      value: location.touristCategory
        ? titleCase(location.touristCategory)
        : t("post_detail.popular_spot"),
    });
  }

  if (location.bestSeason) {
    items.push({
      icon: CalendarDaysIcon,
      tint: "orange",
      label: t("post_detail.best_season"),
      value: location.bestSeason,
    });
  }

  if (location.roadConnectivity) {
    items.push({
      icon: RouteIcon,
      tint: "sky",
      label: t("post_detail.road_connectivity"),
      value: titleCase(location.roadConnectivity),
    });
  }

  if (location.nearestRailwayKm) {
    items.push({
      icon: TrainFrontIcon,
      tint: "violet",
      label: t("post_detail.nearest_railway"),
      value: t("post_detail.distance_km", { value: location.nearestRailwayKm }),
    });
  }

  if (location.nearestAirportKm) {
    items.push({
      icon: PlaneIcon,
      tint: "rose",
      label: t("post_detail.nearest_airport"),
      value: t("post_detail.distance_km", { value: location.nearestAirportKm }),
    });
  }

  const amenityLabels = [
    location.hasHealthcare && t("post_detail.healthcare"),
    location.hasSchool && t("post_detail.school"),
    location.hasBank && t("post_detail.bank"),
    location.hasPostOffice && t("post_detail.post_office"),
    location.hasInternet && t("post_detail.internet"),
  ].filter(Boolean) as string[];

  if (amenityLabels.length > 0) {
    items.push({
      icon: Landmark,
      tint: "emerald",
      label: t("post_detail.amenities"),
      value: amenityLabels.join(", "),
    });
  }

  // Pair items into rows of 2
  const rows: [LocationItemProps, LocationItemProps | null][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], items[i + 1] ?? null]);
  }

  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Text
          size="xs"
          className="text-app-text mb-4 font-bold uppercase tracking-wide opacity-50 dark:text-white"
        >
          {t("post_detail.about_location")}
        </Text>

        <Box className="gap-4">
          {rows.map((row, rowIdx) => (
            <Box key={rowIdx} className="flex-row gap-4">
              <LocationItem {...row[0]} />
              {row[1] ? (
                <LocationItem {...row[1]} />
              ) : (
                <Box className="flex-1" />
              )}
            </Box>
          ))}
        </Box>

        {location.centroid && (
          <MapTile
            latitude={location.centroid.lat}
            longitude={location.centroid.lng}
          />
        )}
      </VStack>
    </Card>
  );
});
