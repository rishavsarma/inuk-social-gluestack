import React from "react";

import { useTranslation } from "react-i18next";

import {
  POST_METADATA_TINTS,
  type MetadataTintName,
} from "@/constants/post-metadata-tints";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface GeoMapCardProps {
  label: string;
  tint?: MetadataTintName;
  className?: string;
}

function GeoMapCard({ label, tint = "green", className }: GeoMapCardProps) {
  const { t } = useTranslation();
  const tintStyle = POST_METADATA_TINTS[tint];

  return (
    <Box
      className={`mx-4 h-40 items-end justify-end overflow-hidden rounded-2xl p-3 ${tintStyle.iconBg} ${className ?? ""}`}
    >
      <Text className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
        {t("geo.map_caption", { label })}
      </Text>
    </Box>
  );
}

export default React.memo(GeoMapCard);
