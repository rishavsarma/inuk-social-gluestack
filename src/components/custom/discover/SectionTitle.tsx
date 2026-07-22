import React from "react";

import { Text } from "@/components/ui/text";

import { WEB_FONT_ROUND } from "@/constants/web-reference-theme";

interface SectionTitleProps {
  children: React.ReactNode;
}

/** Shared Discover lens section heading — e.g. "Popular places", "Regions", "Trending tags". */
function SectionTitle({ children }: SectionTitleProps) {
  return (
    <Text className={`${WEB_FONT_ROUND[700]} text-muted-foreground mb-3 mt-4 px-4 text-sm`}>
      {children}
    </Text>
  );
}

export default React.memo(SectionTitle);
