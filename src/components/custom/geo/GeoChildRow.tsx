import React from "react";

import { ChevronRight } from "lucide-react-native";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface GeoChildRowProps {
  name: string;
  subtitle: string;
  badgeLabel?: string;
  onPress: () => void;
  accessibilityLabel: string;
}

function GeoChildRow({
  name,
  subtitle,
  badgeLabel,
  onPress,
  accessibilityLabel,
}: GeoChildRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="active:opacity-80"
    >
      <HStack
        space="md"
        className="items-center rounded-2xl border border-border bg-card px-4 py-3"
      >
        <Box className="h-10 w-10 items-center justify-center rounded-xl bg-muted">
          <Text className="text-sm font-bold text-foreground">
            {name.charAt(0).toUpperCase()}
          </Text>
        </Box>
        <VStack className="flex-1">
          <HStack space="xs" className="items-center">
            <Heading
              size="sm"
              className="text-foreground"
              numberOfLines={1}
            >
              {name}
            </Heading>
            {badgeLabel && (
              <Badge variant="outline" className="border-0 bg-muted px-1.5 py-0">
                <BadgeText className="text-[10px] text-muted-foreground">
                  {badgeLabel}
                </BadgeText>
              </Badge>
            )}
          </HStack>
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {subtitle}
          </Text>
        </VStack>
        <Icon as={ChevronRight} size="sm" className="text-muted-foreground" />
      </HStack>
    </Pressable>
  );
}

export default React.memo(GeoChildRow);
