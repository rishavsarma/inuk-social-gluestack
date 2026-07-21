import React from "react";

import { router } from "expo-router";

import { Button, ButtonIcon } from "@/components/ui/button";

import { SearchIcon, BellIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Badge, BadgeText, BadgeIcon } from "@/components/ui/badge";

import Logo from "@/components/custom/Logo";

import { ROUTES } from "@/routes";
import { HStack } from "@/components/ui/hstack";

function FeedHeader({
  firstWord = "soc",
  secondWord = "ial",
  showNotificationsBadge,
  showSearchButton,
}: {
  firstWord?: string;
  secondWord?: string;
  showNotificationsBadge?: boolean;
  showSearchButton?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <HStack className="flex-row  items-center justify-between px-2 py-2">
      <Logo size={34} firstWord={firstWord} secondWord={secondWord} />

      <HStack space="sm" className="items-center">
        {/* <Button
          variant="outline"
          size="icon"
          onPress={() => router.push(ROUTES.TABS.EXPLORE)}
          accessibilityRole="button"
          accessibilityLabel={t("search.title")}
          className="rounded-full"
        >
          <ButtonIcon as={SearchIcon} size="lg" className="stroke-3" />
          </Button> */}
        {showSearchButton && (
          <Button
            variant="outline"
            size="default"
            onPress={() => router.push(ROUTES.TABS.EXPLORE)}
            accessibilityRole="button"
            accessibilityLabel={t("search.title")}
            className="rounded-full bg-card h-12 w-12"
          >
            <ButtonIcon as={SearchIcon} size="" className="size-6 stroke-2" />
          </Button>
        )}
        {showNotificationsBadge && (
          <Button
            variant="outline"
            size="default"
            onPress={() => router.push(ROUTES.TABS.NOTIFICATIONS)}
            accessibilityRole="button"
            accessibilityLabel={t("search.title")}
            className="rounded-full bg-card h-12 w-12"
          >
            <ButtonIcon as={BellIcon} size="" className="size-6 stroke-2" />
          </Button>
        )}
      </HStack>
    </HStack>
  );
}

export default FeedHeader;
