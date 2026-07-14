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
    iconColor: "text-[#3B82F6]",
    iconColorFilled: "text-[#3B82F6] fill-[#3B82F6]",
  },
  violet: {
    iconBg: "bg-violet-100 dark:bg-[#1A0D33]",
    iconColor: "text-[#A78BFA]",
    iconColorFilled: "text-[#A78BFA] fill-[#A78BFA]",
  },
  rose: {
    iconBg: "bg-rose-100 dark:bg-[#2D0A0A]",
    iconColor: "text-[#FB7185]",
    iconColorFilled: "text-[#FB7185] fill-[#FB7185]",
  },
  red: {
    iconBg: "bg-red-100 dark:bg-[#2D0A0A]",
    iconColor: "text-[#EF4444]",
    iconColorFilled: "text-[#EF4444] fill-[#EF4444]",
  },
  orange: {
    iconBg: "bg-orange-100 dark:bg-[#2D1400]",
    iconColor: "text-[#FB923C]",
    iconColorFilled: "text-[#FB923C] fill-[#FB923C]",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-[#3B2B00]",
    iconColor: "text-[#F59E0B]",
    iconColorFilled: "text-[#F59E0B] fill-[#F59E0B]",
  },
  sky: {
    iconBg: "bg-sky-100 dark:bg-[#0C2D3A]",
    iconColor: "text-[#38BDF8]",
    iconColorFilled: "text-[#38BDF8] fill-[#38BDF8]",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-[#0A2D14]",
    iconColor: "text-[#34D399]",
    iconColorFilled: "text-[#34D399] fill-[#34D399]",
  },
  green: {
    iconBg: "bg-green-100 dark:bg-[#0A2D14]",
    iconColor: "text-[#22C55E]",
    iconColorFilled: "text-[#22C55E] fill-[#22C55E]",
  },
} as const satisfies Record<string, MetadataTint>;

export type MetadataTintName = keyof typeof POST_METADATA_TINTS;
