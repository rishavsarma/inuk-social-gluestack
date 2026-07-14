import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import {
  CompassIcon,
  LucideIcon,
  MapPinIcon,
  MountainIcon,
  NavigationIcon,
} from "lucide-react-native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PostEnvironmentCardProps {
  post: PostDetail;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

interface EnvStyle {
  iconBg: string;
  iconColor: string;
}

// Matched against the stable `type` identifier, not the (translated) `label`.
function getEnvStyle(type: string): EnvStyle {
  if (type === "location")
    return {
      iconBg: POST_METADATA_TINTS.rose.iconBg,
      iconColor: POST_METADATA_TINTS.rose.iconColor,
    };
  if (type === "coordinates")
    return {
      iconBg: POST_METADATA_TINTS.violet.iconBg,
      iconColor: POST_METADATA_TINTS.violet.iconColor,
    };
  if (type === "altitude")
    return {
      iconBg: POST_METADATA_TINTS.emerald.iconBg,
      iconColor: POST_METADATA_TINTS.emerald.iconColor,
    };
  if (type === "direction")
    return {
      iconBg: POST_METADATA_TINTS.sky.iconBg,
      iconColor: POST_METADATA_TINTS.sky.iconColor,
    };
  return {
    iconBg: "bg-background",
    iconColor: "text-foreground/70",
  };
}

function getEnvIcon(type: string, fallback: LucideIcon): LucideIcon {
  if (type === "location") return MapPinIcon;
  if (type === "coordinates") return CompassIcon;
  if (type === "altitude") return MountainIcon;
  if (type === "direction") return NavigationIcon;
  return fallback;
}

// ─── EnvItem ───────────────────────────────────────────────────────────────

interface EnvItemProps {
  icon: LucideIcon;
  type: string;
  label: string;
  value: string;
}

const EnvItem = React.memo(function EnvItem({
  icon,
  type,
  label,
  value,
}: EnvItemProps) {
  const style = getEnvStyle(type);
  const resolvedIcon = getEnvIcon(type, icon);

  return (
    <HStack className="flex-1 flex-row items-center gap-3">
      <Box
        className={cn(
          "p-4 items-center justify-center rounded-2xl",
          style.iconBg,
        )}
      >
        <Icon as={resolvedIcon} size="lg" className={style.iconColor} />
      </Box>

      <VStack space="xs" className="flex-1">
        <Text
          className="text-xs text-foreground/50 font-medium"
          numberOfLines={1}
        >
          {label}
        </Text>
        <Text
          className="text-sm font-bold text-foreground"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
      </VStack>
    </HStack>
  );
});

// ─── Map Tile ──────────────────────────────────────────────────────────────

interface MapTileProps {
  latitude: number;
  longitude: number;
}

const MapTile = React.memo(function MapTile({
  latitude,
  longitude,
}: MapTileProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="mt-4">
      <Pressable
        className="overflow-hidden rounded-2xl border-0"
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 100 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 150 });
        }}
        onPress={() =>
          import("expo-linking").then((Linking) =>
            Linking.openURL(`maps://?q=${latitude},${longitude}`),
          )
        }
        accessibilityRole="button"
        accessibilityLabel={t("post_detail.open_maps_a11y")}
      >
        {/* Map placeholder */}
        <View className="h-32.5 w-full items-center justify-center bg-muted">
          {/* Grid lines */}
          <View className="absolute inset-0 opacity-20">
            <View className="h-full w-full border-0 border-black/30 dark:border-white/30" />
            <View className="absolute left-1/4 h-full w-px bg-black/30 dark:bg-white/30" />
            <View className="absolute left-2/4 h-full w-px bg-black/30 dark:bg-white/30" />
            <View className="absolute left-3/4 h-full w-px bg-black/30 dark:bg-white/30" />
            <View className="absolute top-1/3 h-px w-full bg-black/30 dark:bg-white/30" />
            <View className="absolute top-2/3 h-px w-full bg-black/30 dark:bg-white/30" />
          </View>

          {/* Crosshair ring */}
          <View className="h-14 w-14 items-center justify-center rounded-full border-2 border-[#FB7185]/40 bg-[#FB7185]/10">
            <Icon as={MapPinIcon} size="xl" className={POST_METADATA_TINTS.rose.iconColor} />
          </View>

          {/* Coords badge */}
          <View className="absolute bottom-2.5 left-3 rounded-lg bg-black/60 px-3 py-1">
            <Text className="text-[10px] font-semibold tabular-nums text-white/90">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          </View>

          {/* Open Maps CTA */}
          <View className="absolute bottom-2.5 right-3 flex-row items-center gap-1 rounded-lg bg-black/60 px-3 py-1">
            <Icon as={NavigationIcon} size="xs" className="text-white/80" />
            <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
              {t("post_detail.open_maps")}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

// ─── Component ─────────────────────────────────────────────────────────────

export const PostEnvironmentCard = React.memo(function PostEnvironmentCard({
  post,
}: PostEnvironmentCardProps) {
  const { t } = useTranslation();
  const { enviroment } = post;

  if (
    !enviroment.place &&
    (!enviroment.weatherInfo || enviroment.weatherInfo.length === 0) &&
    (!enviroment.latitude || !enviroment.longitude)
  ) {
    return null;
  }

  // Build unified list: place first, then weatherInfo items
  const items: EnvItemProps[] = [];

  if (enviroment.place) {
    items.push({
      icon: MapPinIcon,
      type: "location",
      label: t("post_detail.location"),
      value: enviroment.place,
    });
  }

  for (const w of enviroment.weatherInfo ?? []) {
    items.push({ icon: w.icon, type: w.type, label: w.label, value: w.value });
  }

  // Pair items into rows of 2
  const rows: [EnvItemProps, EnvItemProps | null][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], items[i + 1] ?? null]);
  }

  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Text className="text-app-text mb-4 text-sm font-bold uppercase tracking-wide opacity-50 dark:text-white">
          {t("post_detail.environment")}
        </Text>

        <Box className="gap-4">
          {rows.map((row, rowIdx) => (
            <Box key={rowIdx} className="flex-row gap-4">
              <EnvItem {...row[0]} />
              {row[1] ? <EnvItem {...row[1]} /> : <Box className="flex-1" />}
            </Box>
          ))}
        </Box>

        {enviroment.latitude && enviroment.longitude && (
          <MapTile
            latitude={enviroment.latitude}
            longitude={enviroment.longitude}
          />
        )}
      </VStack>
    </Card>
  );
});
