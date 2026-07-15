import React from "react";

import { AnimatedStatNumber } from "@/components/custom/NumberFormatter";

import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface GeoStat {
  value: number;
  label: string;
}

interface GeoStatRowProps {
  stats: GeoStat[];
}

function GeoStatRow({ stats }: GeoStatRowProps) {
  return (
    <HStack className="items-center justify-around px-4">
      {stats.map((stat) => (
        <VStack key={stat.label} className="items-center">
          <AnimatedStatNumber value={stat.value} />
          <Text className="text-xs text-muted-foreground">{stat.label}</Text>
        </VStack>
      ))}
    </HStack>
  );
}

export default React.memo(GeoStatRow);
