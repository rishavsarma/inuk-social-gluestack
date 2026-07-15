import React from "react";

import { HStack } from "@/components/ui/hstack";
import { View } from "react-native";

export function ThemeSwatch({ id }: { id: AppTheme }) {
  if (id === "system") {
    return (
      <HStack className="h-11 w-16 overflow-hidden rounded-lg border border-border">
        <View className="flex-1 bg-white" />
        <View className="flex-1 bg-neutral-950" />
      </HStack>
    );
  }

  return (
    <View
      className={
        id === "light"
          ? "h-11 w-16 rounded-lg border border-border bg-white"
          : "h-11 w-16 rounded-lg border border-border bg-neutral-950"
      }
    />
  );
}
