// Shared icon/background tint pairs for post metadata cards (performance,
// camera EXIF, environment). Centralized here because PostPerformanceCard,
// PostCameraCard and PostEnvironmentCard each re-typed the same handful of
// hex values independently — kept as full literal class strings (not
// assembled from hex fragments) so NativeWind's content scanner can still
// find them.
export interface MetadataTint {
  iconBg: string;
  iconColor: string;
  iconColorFilled: string;
}

export const POST_METADATA_TINTS = {
  blue: {
    iconBg: "bg-blue-100 dark:bg-[#0D1B33]",
    iconColor: "text-blue-500",
    iconColorFilled: "text-blue-500 fill-blue-500",
  },
  violet: {
    iconBg: "bg-violet-100 dark:bg-[#1A0D33]",
    iconColor: "text-violet-400",
    iconColorFilled: "text-violet-400 fill-violet-400",
  },
  rose: {
    iconBg: "bg-rose-100 dark:bg-[#2D0A0A]",
    iconColor: "text-rose-400",
    iconColorFilled: "text-rose-400 fill-rose-400",
  },
  red: {
    iconBg: "bg-red-100 dark:bg-[#2D0A0A]",
    iconColor: "text-red-500",
    iconColorFilled: "text-red-500 fill-red-500",
  },
  orange: {
    iconBg: "bg-orange-100 dark:bg-[#2D1400]",
    iconColor: "text-orange-400",
    iconColorFilled: "text-orange-400 fill-orange-400",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-[#3B2B00]",
    iconColor: "text-amber-500",
    iconColorFilled: "text-amber-500 fill-amber-500",
  },
  sky: {
    iconBg: "bg-sky-100 dark:bg-[#0C2D3A]",
    iconColor: "text-sky-400",
    iconColorFilled: "text-sky-400 fill-sky-400",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-[#0A2D14]",
    iconColor: "text-emerald-400",
    iconColorFilled: "text-emerald-400 fill-emerald-400",
  },
  green: {
    iconBg: "bg-green-100 dark:bg-[#0A2D14]",
    iconColor: "text-green-500",
    iconColorFilled: "text-green-500 fill-green-500",
  },
} as const satisfies Record<string, MetadataTint>;

export type MetadataTintName = keyof typeof POST_METADATA_TINTS;
