import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import {
  ApertureIcon,
  CalendarIcon,
  CameraIcon,
  ClockIcon,
  FocusIcon,
  LucideIcon,
  SunIcon,
  TimerIcon,
} from "lucide-react-native";
import { memo } from "react";
import { useTranslation } from "react-i18next";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PostCameraCardProps {
  cameraExif: { icon: any; type: string; label: string; value: string }[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

interface ExifStyle {
  iconBg: string;
  iconColor: string;
}

// Matched against the stable `type` identifier, not the (translated) `label`.
function getExifStyle(type: string): ExifStyle {
  if (type === "camera")
    return {
      iconBg: POST_METADATA_TINTS.blue.iconBg,
      iconColor: POST_METADATA_TINTS.blue.iconColor,
    };
  if (type === "lens" || type === "focal_length")
    return {
      iconBg: POST_METADATA_TINTS.violet.iconBg,
      iconColor: POST_METADATA_TINTS.violet.iconColor,
    };
  if (type === "aperture")
    return {
      iconBg: POST_METADATA_TINTS.rose.iconBg,
      iconColor: POST_METADATA_TINTS.rose.iconColor,
    };
  if (type === "shutter")
    return {
      iconBg: POST_METADATA_TINTS.orange.iconBg,
      iconColor: POST_METADATA_TINTS.orange.iconColor,
    };
  if (type === "iso")
    return {
      iconBg: POST_METADATA_TINTS.amber.iconBg,
      iconColor: POST_METADATA_TINTS.amber.iconColor,
    };
  if (type === "date_taken" || type === "date_uploaded")
    return {
      iconBg: POST_METADATA_TINTS.sky.iconBg,
      iconColor: POST_METADATA_TINTS.sky.iconColor,
    };
  return {
    iconBg: "bg-background",
    iconColor: "text-foreground/70",
  };
}

function getExifIcon(type: string, fallback: LucideIcon): LucideIcon {
  if (type === "camera") return CameraIcon;
  if (type === "lens") return FocusIcon;
  if (type === "focal_length") return FocusIcon;
  if (type === "aperture") return ApertureIcon;
  if (type === "shutter") return TimerIcon;
  if (type === "iso") return SunIcon;
  if (type === "date_taken") return CalendarIcon;
  if (type === "date_uploaded") return CalendarIcon;
  return fallback;
}

// ─── ExifItem ──────────────────────────────────────────────────────────────

interface ExifItemProps {
  icon: LucideIcon;
  type: string;
  label: string;
  value: string;
}

const ExifItem = memo(function ExifItem({
  icon,
  type,
  label,
  value,
}: ExifItemProps) {
  const style = getExifStyle(type);
  const resolvedIcon = getExifIcon(type, icon);

  return (
    <HStack className="flex-1 flex-row items-center gap-3">
      <Box
        className={cn(
          "p-2.5 items-center justify-center rounded-lg",
          style.iconBg,
        )}
      >
        <Icon as={resolvedIcon} size="sm" className={style.iconColor} />
      </Box>

      <VStack>
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

// ─── Component ─────────────────────────────────────────────────────────────

export const PostCameraCard = memo(function PostCameraCard({
  cameraExif,
}: PostCameraCardProps) {
  const { t } = useTranslation();

  if (!cameraExif || cameraExif.length === 0) return null;

  // Pair items into rows of 2
  const rows: [ExifItemProps, ExifItemProps | null][] = [];
  for (let i = 0; i < cameraExif.length; i += 2) {
    const a = cameraExif[i];
    const b = cameraExif[i + 1] ?? null;
    rows.push([
      { icon: a.icon, type: a.type, label: a.label, value: a.value },
      b ? { icon: b.icon, type: b.type, label: b.label, value: b.value } : null,
    ]);
  }

  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Text
          size="xs"
          className="text-app-text mb-4 font-bold uppercase tracking-wide opacity-50 dark:text-white"
        >
          {t("post_detail.camera_specs")}
        </Text>

        <Box className="gap-4">
          {rows.map((row, rowIdx) => (
            <Box key={rowIdx} className="flex-row gap-4">
              <ExifItem {...row[0]} />
              {row[1] ? <ExifItem {...row[1]} /> : <Box className="flex-1" />}
            </Box>
          ))}
        </Box>
      </VStack>
    </Card>
  );
});
