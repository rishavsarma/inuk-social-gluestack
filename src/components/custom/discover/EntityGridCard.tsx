import React from "react";

import type { LucideIcon } from "lucide-react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { WEB_FONT_BODY, WEB_FONT_ROUND } from "@/constants/web-reference-theme";

interface EntityGridCardProps {
  /** Icon rendered inside the leading colour box. */
  icon: LucideIcon;
  /** Icon glyph colour — literal hex, since per-item taxonomy/location colours come from
   * runtime data (JSON/constants) and can't be pre-compiled into static NativeWind classes. */
  iconColor?: string;
  /** Icon glyph classes, for call sites that use a fixed brand colour instead (e.g. `text-white`). */
  iconClassName?: string;
  /** Icon box background — same literal-hex reasoning as `iconColor`. */
  iconBgColor: string;

  name: string;
  nameColor?: string;
  nameClassName?: string;
  nameNumberOfLines?: number;

  subtitle: string;
  subtitleColor?: string;
  subtitleClassName?: string;
  subtitleNumberOfLines?: number;

  onPress: () => void;
  accessibilityLabel?: string;

  /** Outer card sizing/background — kept as a style object since callers size cards with
   * fixed pixel widths (horizontal scroll) or percentage `flexBasis` (wrap grid), and some
   * pass a per-item background colour while others rely on a semantic `bg-muted` class. */
  style?: StyleProp<ViewStyle>;
  className?: string;
}

/** Shared "popular entity" card — icon in a colour box + name + subtitle — used by
 * Discover's Category, Trending and Location lenses for their popular-place/entity grids. */
function EntityGridCard({
  icon,
  iconColor,
  iconClassName,
  iconBgColor,
  name,
  nameColor,
  nameClassName,
  nameNumberOfLines,
  subtitle,
  subtitleColor,
  subtitleClassName,
  subtitleNumberOfLines,
  onPress,
  accessibilityLabel,
  style,
  className,
}: EntityGridCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
      style={style}
      className={className ?? "justify-between rounded-2xl p-3"}
    >
      <Box style={{ backgroundColor: iconBgColor }} className="h-8.5 w-8.5 items-center justify-center rounded-[17px]">
        <Icon as={icon} size="sm" style={iconColor ? { color: iconColor } : undefined} className={iconClassName} />
      </Box>
      <VStack>
        <Text
          numberOfLines={nameNumberOfLines}
          style={nameColor ? { color: nameColor } : undefined}
          className={nameClassName ?? `${WEB_FONT_ROUND[700]} text-sm`}
        >
          {name}
        </Text>
        <Text
          numberOfLines={subtitleNumberOfLines}
          style={subtitleColor ? { color: subtitleColor } : undefined}
          className={subtitleClassName ?? `${WEB_FONT_BODY[400]} mt-px text-xs opacity-70`}
        >
          {subtitle}
        </Text>
      </VStack>
    </Pressable>
  );
}

export default React.memo(EntityGridCard);
