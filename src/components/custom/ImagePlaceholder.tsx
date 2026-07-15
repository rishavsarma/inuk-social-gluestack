import React from "react";

import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";

import { POST_METADATA_TINTS } from "@/constants/post-metadata-tints";

interface ImagePlaceholderProps {
  icon: React.ComponentType<any>;
  tint?: keyof typeof POST_METADATA_TINTS;
  iconSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children?: React.ReactNode;
}

/** Stands in for a missing photo/thumbnail — a tinted box with a centered
 * icon, used anywhere the app doesn't have real media to show yet (mock
 * content, unfetched images). Keeps those spots looking designed instead of
 * like blank/broken placeholders. */
export function ImagePlaceholder({
  icon,
  tint = "sky",
  iconSize = "lg",
  className,
  children,
}: ImagePlaceholderProps) {
  const style = POST_METADATA_TINTS[tint];
  return (
    <Box
      className={cn("items-center justify-center", style.iconBg, className)}
    >
      <Icon as={icon} size={iconSize} className={style.iconColor} />
      {children}
    </Box>
  );
}
