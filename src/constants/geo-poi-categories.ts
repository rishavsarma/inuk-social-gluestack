import {
  Building2,
  Droplet,
  Home,
  Landmark,
  MountainSnow,
  Sunrise,
  Waves,
  type LucideIcon,
} from "lucide-react-native";

import type { MetadataTintName } from "./post-metadata-tints";

interface GeoPoiCategoryStyle {
  icon: LucideIcon;
  tint: MetadataTintName;
}

export const GEO_POI_CATEGORIES = {
  Temple: { icon: Landmark, tint: "amber" },
  Spring: { icon: Droplet, tint: "sky" },
  Viewpoint: { icon: Sunrise, tint: "orange" },
  Homestay: { icon: Home, tint: "green" },
  Waterfall: { icon: Waves, tint: "sky" },
  Trailhead: { icon: MountainSnow, tint: "emerald" },
} as const satisfies Record<GeoPoiCategory, GeoPoiCategoryStyle>;

export const GEO_SETTLEMENT_ICONS: Record<SettlementKind, LucideIcon> = {
  City: Building2,
  Town: Building2,
  Village: Home,
};

export const GEO_SETTLEMENT_TINTS: Record<SettlementKind, MetadataTintName> = {
  City: "sky",
  Town: "amber",
  Village: "green",
};
