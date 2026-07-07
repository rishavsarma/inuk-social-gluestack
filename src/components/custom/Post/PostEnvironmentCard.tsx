import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import {
  CompassIcon,
  LucideIcon,
  MapPinIcon,
  MountainIcon,
  NavigationIcon,
} from "lucide-react-native";
import * as React from "react";
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

function getEnvStyle(label: string): EnvStyle {
  const lower = label.toLowerCase();
  if (lower.includes("location") || lower.includes("place"))
    return {
      iconBg: "bg-rose-100 dark:bg-[#2D0A0A]",
      iconColor: "text-[#FB7185]",
    };
  if (lower.includes("coord") || lower.includes("lat") || lower.includes("lng"))
    return {
      iconBg: "bg-violet-100 dark:bg-[#1A0D33]",
      iconColor: "text-[#A78BFA]",
    };
  if (lower.includes("altitude") || lower.includes("elevation"))
    return {
      iconBg: "bg-emerald-100 dark:bg-[#0A2D14]",
      iconColor: "text-[#34D399]",
    };
  if (lower.includes("direction") || lower.includes("bearing"))
    return {
      iconBg: "bg-sky-100 dark:bg-[#0C2D3A]",
      iconColor: "text-[#38BDF8]",
    };
  return {
    iconBg: "bg-background",
    iconColor: "text-foreground/70",
  };
}

function getEnvIcon(label: string, fallback: LucideIcon): LucideIcon {
  const lower = label.toLowerCase();
  if (lower.includes("location") || lower.includes("place")) return MapPinIcon;
  if (lower.includes("coord")) return CompassIcon;
  if (lower.includes("altitude") || lower.includes("elevation"))
    return MountainIcon;
  if (lower.includes("direction") || lower.includes("bearing"))
    return NavigationIcon;
  return fallback;
}

// ─── EnvItem ───────────────────────────────────────────────────────────────

interface EnvItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const EnvItem = React.memo(function EnvItem({
  icon,
  label,
  value,
}: EnvItemProps) {
  const style = getEnvStyle(label);
  const resolvedIcon = getEnvIcon(label, icon);

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
      >
        {/* Map placeholder */}
        <View
          style={{ width: "100%", height: 130 }}
          className="items-center justify-center bg-[#E5E7EB] dark:bg-[#1C1C1E] "
        >
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
            <Icon as={MapPinIcon} size="xl" className="text-[#FB7185]" />
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
              Open Maps
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
      label: "Location",
      value: enviroment.place,
    });
  }

  for (const w of enviroment.weatherInfo ?? []) {
    items.push({ icon: w.icon, label: w.label, value: w.value });
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
          Environment
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
