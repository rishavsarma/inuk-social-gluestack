import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { ROUTES } from "@/routes";
import { BellIcon, Icon } from "@/components/ui/icon";
import { SearchIcon } from "lucide-react-native";

const FeedHeader = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className="flex-row  items-center justify-between px-2 py-2">
      <Image
        source={
          isDark
            ? require("@/assets/images/splash-dark.png")
            : require("@/assets/images/splash.png")
        }
        style={{ width: 140, height: 40 }}
        contentFit="contain"
      />

      <View className="flex-row items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.push(ROUTES.TABS.EXPLORE)}
          className="rounded-full"
        >
          <Icon as={SearchIcon} className="size-5 text-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.push(ROUTES.TABS.NOTIFICATIONS)}
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
