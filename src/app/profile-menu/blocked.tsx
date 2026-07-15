import React, { useCallback, useState } from "react";

import { Ban } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { FlashList } from "@shopify/flash-list";

import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { BlockedProfileItem, useBlockedStore } from "@/stores/blocked.store";

function BlockedRow({
  item,
  onUnblock,
}: {
  item: BlockedProfileItem;
  onUnblock: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <HStack
      space="md"
      className="mx-4 mb-2 items-center rounded-xl border border-border bg-card px-4 py-3"
    >
      <Avatar className="h-10 w-10">
        <AvatarFallbackText>{item.displayName}</AvatarFallbackText>
        <AvatarImage
          source={{ uri: item.avatarUrl ?? undefined }}
          alt={item.displayName}
        />
      </Avatar>
      <VStack className="flex-1">
        <Text className="font-semibold text-foreground">
          {item.displayName}
        </Text>
        <Text className="text-xs text-muted-foreground">
          @{item.username}
        </Text>
      </VStack>
      <Button
        variant="outline"
        size="sm"
        onPress={() => onUnblock(item.id)}
        accessibilityRole="button"
        accessibilityLabel={
          item.type === "muted"
            ? t("blocked_muted.unmute")
            : t("blocked_muted.unblock")
        }
        className="rounded-full"
      >
        <ButtonText>
          {item.type === "muted"
            ? t("blocked_muted.unmute")
            : t("blocked_muted.unblock")}
        </ButtonText>
      </Button>
    </HStack>
  );
}

function BlockedEmptyState() {
  const { t } = useTranslation();
  return (
    <VStack space="xs" className="items-center px-8 py-12">
      <Icon as={Ban} size="xl" className="text-muted-foreground" />
      <Text className="text-base font-semibold text-foreground">
        {t("blocked_muted.empty_title")}
      </Text>
      <Text className="text-center text-sm text-muted-foreground">
        {t("blocked_muted.empty_sub")}
      </Text>
    </VStack>
  );
}

const BlockedMutedScreen = () => {
  const { t } = useTranslation();
  const entries = useBlockedStore((state) => state.entries);
  const unblock = useBlockedStore((state) => state.unblock);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: BlockedProfileItem }) => (
      <BlockedRow item={item} onUnblock={unblock} />
    ),
    [unblock],
  );

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("profile_bottom_sheet.blocked_muted")}
      variant="list"
    >
      {({ scrollProps, topInset }) => (
        <FlashList
          data={entries}
          renderItem={renderItem}
          keyExtractor={(item: BlockedProfileItem) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={<BlockedEmptyState />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: topInset,
            paddingBottom: 120,
          }}
          {...scrollProps}
        />
      )}
    </KeyboardAvoidingScrollView>
  );
};

export default BlockedMutedScreen;
