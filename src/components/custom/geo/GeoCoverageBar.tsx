import React from "react";

import { useTranslation } from "react-i18next";

import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface GeoCoverageBarProps {
  percent: number;
  className?: string;
}

function GeoCoverageBar({ percent, className }: GeoCoverageBarProps) {
  const { t } = useTranslation();

  return (
    <VStack space="xs" className={`px-4 ${className ?? ""}`}>
      <HStack className="items-center justify-between">
        <Text className="text-sm font-semibold text-muted-foreground">
          {t("place.coverage_label", { percent })}
        </Text>
      </HStack>
      <Progress value={percent}>
        <ProgressFilledTrack />
      </Progress>
    </VStack>
  );
}

export default React.memo(GeoCoverageBar);
