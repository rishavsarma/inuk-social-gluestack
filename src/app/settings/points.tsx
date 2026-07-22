import React, { useCallback, useMemo, useState } from "react";

import { Sparkles, TrendingDown, TrendingUp } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { FlashList } from "@shopify/flash-list";
import { compareDesc } from "date-fns";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useWalletStore, SparkTransactionItem } from "@/stores/wallet.store";

import { useTimeAgo } from "@/hooks/useTimeAgo";

import { InlineEmptyState } from "@/components/custom/InlineEmptyState";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { ListRowCard } from "@/components/custom/ListRowCard";
import { AnimatedStatNumber } from "@/components/custom/NumberFormatter";

interface TransactionRowProps {
  item: SparkTransactionItem;
}

function TransactionRow({ item }: TransactionRowProps) {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo(item.timestamp);
  const isEarned = item.amount >= 0;

  return (
    <ListRowCard
      leading={
        <Box
          className={`h-10 w-10 items-center justify-center rounded-full ${
            isEarned
              ? "bg-green-500/10 dark:bg-green-500/20"
              : "bg-red-500/10 dark:bg-red-500/20"
          }`}
        >
          <Icon
            as={isEarned ? TrendingUp : TrendingDown}
            size="md"
            className={isEarned ? "text-green-600" : "text-red-500"}
          />
        </Box>
      }
      trailing={
        <Text
          className={`text-base font-bold ${
            isEarned ? "text-green-600" : "text-red-500"
          }`}
        >
          {isEarned ? `+${item.amount}` : `${item.amount}`}
        </Text>
      }
    >
      <VStack className="flex-1">
        <Text className="text-base font-medium text-foreground">
          {t(item.reasonKey)}
        </Text>
        <Text className="text-xs text-muted-foreground">{timeAgo}</Text>
      </VStack>
    </ListRowCard>
  );
}

interface SparksHeaderProps {
  points: number;
  hasTransactions: boolean;
}

function SparksHeader({ points, hasTransactions }: SparksHeaderProps) {
  const { t } = useTranslation();

  return (
    <VStack space="lg" className="px-4 pb-4">
      <Card
        accessibilityLabel={t("profile.sparks_balance", { count: points })}
        className="items-center gap-2 border border-border p-6 shadow-none"
      >
        <Box className="h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 dark:bg-amber-500/20">
          <Icon as={Sparkles} size="xl" className="text-amber-500" />
        </Box>
        <AnimatedStatNumber value={points} />
        <Text className="text-sm font-semibold text-muted-foreground">
          {t("sparks.inuk_balance")}
        </Text>
        <Text className="text-center text-xs leading-normal text-muted-foreground">
          {t("sparks.earn_more")}
        </Text>
      </Card>

      {hasTransactions && (
        <Text className="px-1 text-sm font-semibold text-muted-foreground">
          {t("sparks.recent_history")}
        </Text>
      )}
    </VStack>
  );
}

function SparksEmptyState() {
  const { t } = useTranslation();

  return (
    <InlineEmptyState
      icon={Sparkles}
      title={t("sparks.no_history")}
      description={t("sparks.no_history_sub")}
    />
  );
}

const SparksScreen = () => {
  const { t } = useTranslation();
  const points = useWalletStore((state) => state.points);
  const transactions = useWalletStore((state) => state.transactions);
  const [refreshing, setRefreshing] = useState(false);

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort((a, b) =>
        compareDesc(new Date(a.timestamp), new Date(b.timestamp)),
      ),
    [transactions],
  );

  // Local store is the source of truth — refresh just settles the gesture.
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: SparkTransactionItem }) => (
      <TransactionRow item={item} />
    ),
    [],
  );

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("sparks.title")}
      variant="list"
    >
      {({ scrollProps, topInset }) => (
        <FlashList
          data={sortedTransactions}
          renderItem={renderItem}
          keyExtractor={(item: SparkTransactionItem) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            <SparksHeader
              points={points}
              hasTransactions={sortedTransactions.length > 0}
            />
          }
          ListEmptyComponent={<SparksEmptyState />}
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

export default SparksScreen;
