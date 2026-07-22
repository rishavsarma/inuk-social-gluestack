import React from "react";

import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

import { WEB_BORDER_LINE, WEB_FONT_ROUND, WEB_PALETTE, WEB_TEXT_SUB } from "@/constants/web-reference-theme";

interface UnderlineTabBarTab<T extends string> {
  key: T;
  label: string;
}

interface UnderlineTabBarProps<T extends string> {
  tabs: UnderlineTabBarTab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  /** Underline + label colour for the active tab — defaults to the shared brand red. */
  activeColor?: string;
  /** Replaces the default `WEB_BORDER_LINE` border-colour classes outright (e.g. pass
   * `"border-border"` to use the app's semantic token instead). Must fully replace rather
   * than merge — combining a light-only override with `WEB_BORDER_LINE`'s `dark:` class
   * would leave the literal dark colour still winning in dark mode. */
  borderClassName?: string;
  /** Extra non-border classes merged onto the outer bordered container. */
  className?: string;
  /** Extra classes merged onto each tab's `Pressable` (e.g. to adjust vertical padding). */
  tabClassName?: string;
  /** Extra classes merged onto each tab's label `Text` (e.g. to adjust font size). */
  textClassName?: string;
  /** Classes for the inactive label — defaults to the web-reference sub colour. */
  inactiveTextClassName?: string;
}

/** Shared underline segmented tab bar — a bordered row of `Pressable`s, each getting a
 * coloured `border-b-2` and bold label when active. Used by Arena's top-level tabs and
 * the Discover PlaceHub modal's tabs, which render the identical shape with different
 * brand colours/sizes. */
function UnderlineTabBar<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  activeColor = WEB_PALETTE.red,
  borderClassName = WEB_BORDER_LINE,
  className,
  tabClassName,
  textClassName,
  inactiveTextClassName = WEB_TEXT_SUB,
}: UnderlineTabBarProps<T>) {
  return (
    <Box className={cn(borderClassName, "flex-row border-b px-2", className)}>
      {tabs.map((tabItem) => {
        const active = tabItem.key === activeTab;
        return (
          <Pressable
            key={tabItem.key}
            onPress={() => onTabChange(tabItem.key)}
            style={{ borderColor: active ? activeColor : "transparent" }}
            className={cn("flex-1 items-center border-b-2 py-3", tabClassName)}
            accessibilityRole="button"
            accessibilityLabel={tabItem.label}
          >
            <Text
              style={{ color: active ? activeColor : undefined }}
              className={cn(
                active ? WEB_FONT_ROUND[700] : WEB_FONT_ROUND[500],
                "text-xs",
                textClassName,
                active ? undefined : inactiveTextClassName,
              )}
            >
              {tabItem.label}
            </Text>
          </Pressable>
        );
      })}
    </Box>
  );
}

export default UnderlineTabBar;
