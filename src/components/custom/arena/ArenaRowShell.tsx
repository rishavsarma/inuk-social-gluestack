import React from "react";

import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Box } from "@/components/ui/box";

import { WEB_BORDER_LINE } from "@/constants/web-reference-theme";

interface ArenaRowShellProps {
  /** Leading icon/colour box. */
  leading: React.ReactNode;
  /** Label + meta content, typically a `VStack`. */
  children: React.ReactNode;
  /** Trailing meta text or action element. */
  trailing?: React.ReactNode;
  /** Extra classes merged onto the outer bordered row (margins/padding differ per row type). */
  className?: string;
}

/** Shared bordered "row shell" behind Arena's contest/leaderboard/winning rows —
 * a rounded box with the web-reference border wrapping a leading icon, flexible
 * label content, and an optional trailing element. */
function ArenaRowShell({ leading, children, trailing, className }: ArenaRowShellProps) {
  return (
    <Box className={cn(WEB_BORDER_LINE, "flex-row items-center gap-3 rounded-field border", className)}>
      {leading}
      {children}
      {trailing}
    </Box>
  );
}

export default React.memo(ArenaRowShell);
