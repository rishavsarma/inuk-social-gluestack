import { useCallback, useState } from "react";

import { SearchIcon } from "lucide-react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import DiscoverCategoryTab from "@/components/custom/discover/DiscoverCategoryTab";
import DiscoverLocationTab from "@/components/custom/discover/DiscoverLocationTab";
import DiscoverTagTab from "@/components/custom/discover/DiscoverTagTab";
import DiscoverTrendingTab from "@/components/custom/discover/DiscoverTrendingTab";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
} from "@/components/ui/tabs";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { ROUTES } from "@/routes";

type DiscoverTab = "location" | "category" | "tag" | "trending";
const TABS: DiscoverTab[] = ["location", "category", "tag", "trending"];

const DiscoverScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<DiscoverTab>("location");

  const showComingSoonToast = useCallback(() => {
    toast.show({
      placement: "bottom",
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
          <ToastDescription>{t("discover.coming_soon")}</ToastDescription>
        </Toast>
      ),
    });
  }, [t, toast]);

  const header = (
    <VStack space="md" className="pb-2">
      <HStack className="items-center justify-between px-4 pt-2">
        <Heading size="xl">{t("discover.title")}</Heading>
        <Button
          variant="secondary"
          size="icon"
          onPress={() => router.push(ROUTES.TABS.EXPLORE)}
          accessibilityRole="button"
          accessibilityLabel={t("discover.search_a11y")}
          className="h-10 w-10 rounded-full"
        >
          <ButtonIcon as={SearchIcon} />
        </Button>
      </HStack>

      <Tabs
        value={activeTab}
        onValueChange={(value: DiscoverTab) => setActiveTab(value)}
        variant="filled"
        orientation="horizontal"
        className="px-4"
      >
        <TabsList className="rounded-full">
          {TABS.map((tabKey) => (
            <TabsTrigger key={tabKey} value={tabKey} className="flex-1 rounded-full">
              <TabsTriggerText className="data-[selected=true]:text-white">
                {t(`discover.tab_${tabKey}`)}
              </TabsTriggerText>
            </TabsTrigger>
          ))}
          <TabsIndicator className="rounded-full bg-theme" />
        </TabsList>
      </Tabs>
    </VStack>
  );

  if (activeTab === "trending") {
    return (
      <KeyboardAvoidingScrollView variant="list">
        {({ scrollProps, topInset }) => (
          <DiscoverTrendingTab
            onPostPress={showComingSoonToast}
            topInset={topInset}
            scrollProps={scrollProps}
            headerContent={header}
          />
        )}
      </KeyboardAvoidingScrollView>
    );
  }

  return (
    <KeyboardAvoidingScrollView contentContainerStyle={{ paddingBottom: 160 }}>
      <VStack className="pb-2">
        {header}
        {activeTab === "location" && <DiscoverLocationTab />}
        {activeTab === "category" && <DiscoverCategoryTab />}
        {activeTab === "tag" && <DiscoverTagTab />}
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default DiscoverScreen;
