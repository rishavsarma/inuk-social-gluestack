import React from "react";

import { router, type Href } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { ScrollView } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

export interface GeoBreadcrumbTrailItem {
  label: string;
  href?: Href;
}

interface GeoBreadcrumbProps {
  items: GeoBreadcrumbTrailItem[];
}

function GeoBreadcrumb({ items }: GeoBreadcrumbProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <HStack space="xs" className="items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <HStack
              key={`${item.label}-${index}`}
              space="xs"
              className="items-center"
            >
              {item.href && !isLast ? (
                <Pressable
                  onPress={() => router.push(item.href as Href)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Text
                    numberOfLines={1}
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ) : (
                <Text
                  numberOfLines={1}
                  className={
                    isLast
                      ? "text-xs font-semibold text-foreground"
                      : "text-xs font-medium text-muted-foreground"
                  }
                >
                  {item.label}
                </Text>
              )}
              {!isLast && (
                <Icon
                  as={ChevronRight}
                  size="xs"
                  className="text-muted-foreground"
                />
              )}
            </HStack>
          );
        })}
      </HStack>
    </ScrollView>
  );
}

export default React.memo(GeoBreadcrumb);
