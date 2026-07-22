import React from "react";

import { ChevronRight } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MENU_ROW_TINTS } from "@/constants";

interface SettingsRowProps {
  icon: React.ComponentType<any>;
  tint: keyof typeof MENU_ROW_TINTS;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

export function SettingsRow({
  icon,
  tint,
  title,
  subtitle,
  onPress,
  rightElement,
  destructive = false,
}: SettingsRowProps) {
  const { iconBg, iconColor } = MENU_ROW_TINTS[tint];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
      className={onPress ? "active:opacity-70" : undefined}
    >
      <HStack space="sm" className="items-center px-4 py-3">
        <Box
          className={`p-2 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon as={icon} size="sm" className={iconColor} />
        </Box>
        <VStack className="flex-1">
          <Text
            size="sm"
            className={`font-semibold ${
              destructive ? "text-red-500" : "text-foreground"
            }`}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              size="xs"
              className={
                destructive ? "text-red-400" : "text-muted-foreground"
              }
            >
              {subtitle}
            </Text>
          ) : null}
        </VStack>
        {rightElement ??
          (onPress ? (
            <Icon
              as={ChevronRight}
              size="sm"
              className="text-muted-foreground"
            />
          ) : null)}
      </HStack>
    </Pressable>
  );
}

export function SettingsSectionHeader({ title }: { title: string }) {
  return (
    <Box className="px-4 pt-4">
      <Text size="sm" className="font-semibold capitalize text-muted-foreground">
        {title}
      </Text>
    </Box>
  );
}
