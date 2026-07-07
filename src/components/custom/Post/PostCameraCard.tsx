import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
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

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PostCameraCardProps {
  cameraExif: { icon: any; label: string; value: string }[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

interface ExifStyle {
  iconBg: string;
  iconColor: string;
}

function getExifStyle(label: string): ExifStyle {
  const lower = label.toLowerCase();
  if (lower.includes("camera"))
    return {
      iconBg: "bg-blue-100 dark:bg-[#0D1B33]",
      iconColor: "text-[#3B82F6]",
    };
  if (lower.includes("lens") || lower.includes("focal"))
    return {
      iconBg: "bg-violet-100 dark:bg-[#1A0D33]",
      iconColor: "text-[#A78BFA]",
    };
  if (lower.includes("aperture"))
    return {
      iconBg: "bg-rose-100 dark:bg-[#2D0A0A]",
      iconColor: "text-[#FB7185]",
    };
  if (lower.includes("shutter") || lower.includes("exposure"))
    return {
      iconBg: "bg-orange-100 dark:bg-[#2D1400]",
      iconColor: "text-[#FB923C]",
    };
  if (lower.includes("iso"))
    return {
      iconBg: "bg-amber-100 dark:bg-[#3B2B00]",
      iconColor: "text-[#F59E0B]",
    };
  if (lower.includes("date") || lower.includes("time"))
    return {
      iconBg: "bg-sky-100 dark:bg-[#0C2D3A]",
      iconColor: "text-[#38BDF8]",
    };
  return {
    iconBg: "bg-background",
    iconColor: "text-foreground/70",
  };
}

function getExifIcon(label: string, fallback: LucideIcon): LucideIcon {
  const lower = label.toLowerCase();
  if (lower.includes("camera")) return CameraIcon;
  if (lower.includes("lens")) return FocusIcon;
  if (lower.includes("focal")) return FocusIcon;
  if (lower.includes("aperture")) return ApertureIcon;
  if (lower.includes("shutter") || lower.includes("exposure")) return TimerIcon;
  if (lower.includes("iso")) return SunIcon;
  if (lower.includes("date taken")) return CalendarIcon;
  if (lower.includes("date uploaded")) return CalendarIcon;
  if (lower.includes("time")) return ClockIcon;
  return fallback;
}

// ─── ExifItem ──────────────────────────────────────────────────────────────

interface ExifItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const ExifItem = memo(function ExifItem({ icon, label, value }: ExifItemProps) {
  const style = getExifStyle(label);
  const resolvedIcon = getExifIcon(label, icon);

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

// ─── Component ─────────────────────────────────────────────────────────────

export const PostCameraCard = memo(function PostCameraCard({
  cameraExif,
}: PostCameraCardProps) {
  if (!cameraExif || cameraExif.length === 0) return null;

  // Pair items into rows of 2
  const rows: [ExifItemProps, ExifItemProps | null][] = [];
  for (let i = 0; i < cameraExif.length; i += 2) {
    const a = cameraExif[i];
    const b = cameraExif[i + 1] ?? null;
    rows.push([
      { icon: a.icon, label: a.label, value: a.value },
      b ? { icon: b.icon, label: b.label, value: b.value } : null,
    ]);
  }

  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Text className="text-app-text mb-4 text-sm font-bold uppercase tracking-wide opacity-50 dark:text-white">
          Camera Specs
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
