import React from "react";

import { Star } from "lucide-react-native";

import {
  POST_METADATA_TINTS,
  type MetadataTintName,
} from "@/constants/post-metadata-tints";

import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface GeoCoverHeroProps {
  title: string;
  subtitle: string;
  badgeLabel: string;
  touristWorthy?: boolean;
  tint?: MetadataTintName;
}

function GeoCoverHero({
  title,
  subtitle,
  badgeLabel,
  touristWorthy = false,
  tint = "green",
}: GeoCoverHeroProps) {
  const tintStyle = POST_METADATA_TINTS[tint];

  return (
    <Box className={`h-56 w-full justify-between p-4 pt-16 ${tintStyle.iconBg}`}>
      <Badge
        variant="outline"
        className="self-start border-0 bg-background/80 px-2.5 py-1"
      >
        <BadgeText className="text-foreground">{badgeLabel}</BadgeText>
        {touristWorthy && (
          <BadgeIcon
            as={Star}
            size={12}
            className="ml-1 text-amber-500 fill-amber-500"
          />
        )}
      </Badge>
      <VStack>
        <Heading size="2xl" className="text-foreground">
          {title}
        </Heading>
        <Text className="text-sm text-muted-foreground">{subtitle}</Text>
      </VStack>
    </Box>
  );
}

export default React.memo(GeoCoverHero);
