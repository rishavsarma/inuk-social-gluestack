import { useCallback, useMemo, useState } from "react";

import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { Trophy } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/custom/Feed/EmptyState";
import ContestCard from "@/components/custom/Contest/ContestCard";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
} from "@/components/ui/tabs";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { MOCK_CONTESTS } from "@/constants/mock-data";

const STATUS_FILTERS: ContestStatus[] = ["ACTIVE", "UPCOMING", "ENDED"];

const EMPTY_DESCRIPTION_KEY: Record<ContestStatus, string> = {
  ACTIVE: "contest_tab.no_contests",
  UPCOMING: "contest_tab.no_contests_upcoming",
  ENDED: "contest_tab.no_contests_ended",
};

const ContestScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [activeStatus, setActiveStatus] = useState<ContestStatus>("ACTIVE");

  const contests = useMemo(
    () => MOCK_CONTESTS.filter((contest) => contest.status === activeStatus),
    [activeStatus],
  );

  const handleContestPress = useCallback(
    (contest: ContestItem) => {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
            <ToastDescription>{t("contest_tab.coming_soon")}</ToastDescription>
          </Toast>
        ),
      });
    },
    [t, toast],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ContestItem>) => (
      <Box className="px-4">
        <ContestCard contest={item} onPress={handleContestPress} />
      </Box>
    ),
    [handleContestPress],
  );

  const listHeader = useMemo(
    () => (
      <VStack space="md" className="pb-3">
        <Heading size="xl" className="px-4 pt-2">
          {t("contest_tab.title")}
        </Heading>
        <Tabs
          value={activeStatus}
          onValueChange={(value: ContestStatus) => setActiveStatus(value)}
          variant="underlined"
          orientation="horizontal"
          className="px-4"
        >
          <TabsList className="bg-transparent rounded-none pb-0.5">
            {STATUS_FILTERS.map((status) => (
              <TabsTrigger key={status} value={status} className="flex-1">
                <TabsTriggerText>
                  {t(`contest_tab.status_${status}`)}
                </TabsTriggerText>
              </TabsTrigger>
            ))}
            <TabsIndicator className="border-b" />
          </TabsList>
        </Tabs>
      </VStack>
    ),
    [activeStatus, t],
  );

  const listEmptyComponent = useMemo(
    () => (
      <EmptyState
        icon={Trophy}
        title={t("contest_tab.empty_title")}
        description={t(EMPTY_DESCRIPTION_KEY[activeStatus])}
        fullScreen={false}
      />
    ),
    [activeStatus, t],
  );

  return (
    <KeyboardAvoidingScrollView variant="list">
      {({ scrollProps, topInset }) => (
        <FlashList
          data={contests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          {...scrollProps}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: topInset, paddingBottom: 160 }}
          ListHeaderComponent={listHeader}
          ItemSeparatorComponent={() => <Box className="h-3" />}
          ListEmptyComponent={listEmptyComponent}
        />
      )}
    </KeyboardAvoidingScrollView>
  );
};

export default ContestScreen;
