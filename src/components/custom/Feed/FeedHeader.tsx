import { View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { ROUTES } from "@/routes";
import { BellIcon, Icon } from "@/components/ui/icon";
import { SearchIcon } from "lucide-react-native";
import Logo from "@/components/custom/Logo";

const FeedHeader = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-row  items-center justify-between px-2 py-2">
      <Logo size={34} />

      <View className="flex-row items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.push(ROUTES.TABS.EXPLORE)}
          accessibilityRole="button"
          accessibilityLabel={t("search.title")}
          className="rounded-full"
        >
          <Icon as={SearchIcon} className="size-5 text-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.push(ROUTES.TABS.NOTIFICATIONS)}
          accessibilityRole="button"
          accessibilityLabel={t("notifications.title")}
          className="rounded-full"
        >
          <Icon as={BellIcon} className="size-5 text-foreground" />
          <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-[1.5px] border-background bg-destructive" />
        </Button>
      </View>
    </View>
  );
};

export default FeedHeader;
