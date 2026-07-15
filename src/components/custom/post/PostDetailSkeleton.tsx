import { PostAwardsSkeleton } from "@/components/custom/post/PostAwardsCard";
import { PostBadgesSkeleton } from "@/components/custom/post/PostBadgesCard";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { POST_CONSTANTS } from "@/constants";
import * as React from "react";
import { View } from "react-native";

function StatRowsSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <Box className="gap-4">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Box key={rowIdx} className="flex-row gap-4">
          {[0, 1].map((col) => (
            <HStack key={col} className="flex-1 flex-row items-center gap-3">
              <Skeleton
                variant="rounded"
                className="h-[52px] w-[52px] rounded-2xl"
              />
              <VStack space="xs" className="flex-1">
                <Skeleton className="h-2.5 w-14 rounded" />
                <Skeleton className="h-3.5 w-20 rounded" />
              </VStack>
            </HStack>
          ))}
        </Box>
      ))}
    </Box>
  );
}

function SectionCardSkeleton({
  titleWidthClassName,
  rows,
}: {
  titleWidthClassName: string;
  rows: number;
}) {
  return (
    <Card className="rounded-none shadow-none border-0">
      <VStack>
        <Skeleton className={`mb-4 h-3 ${titleWidthClassName} rounded`} />
        <StatRowsSkeleton rows={rows} />
      </VStack>
    </Card>
  );
}

export function PostDetailSkeleton() {
  return (
    <View className="flex-1 bg-background">
      {/* Hero media */}
      <Box
        style={{ height: POST_CONSTANTS.HERO_HEIGHT }}
        className="w-full overflow-hidden"
      >
        <Skeleton className="h-full w-full" />

        {/* Author overlay */}
        <HStack
          space="md"
          className="absolute bottom-4 left-4 right-4 items-center"
        >
          <Skeleton
            variant="circular"
            className="h-14 w-14 border-2 border-white/30 bg-white/25"
          />
          <VStack space="xs" className="flex-1">
            <Skeleton className="h-4 w-32 rounded bg-white/25" />
            <Skeleton className="h-3 w-20 rounded bg-white/25" />
          </VStack>
          <Skeleton
            variant="rounded"
            className="h-9 w-24 rounded-full bg-white/25"
          />
        </HStack>
      </Box>

      <VStack space="sm" className="bg-background">
        {/* Caption */}
        <Card className="rounded-none shadow-none border-0">
          <VStack space="sm">
            <Skeleton className="h-5 w-1/2 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
          </VStack>
        </Card>

        {/* Camera specs */}
        <SectionCardSkeleton titleWidthClassName="w-28" rows={2} />

        {/* Environment */}
        <SectionCardSkeleton titleWidthClassName="w-24" rows={1} />

        {/* Performance */}
        <SectionCardSkeleton titleWidthClassName="w-28" rows={3} />

        {/* Awards */}
        <PostAwardsSkeleton />

        {/* Badges */}
        <PostBadgesSkeleton />
      </VStack>
    </View>
  );
}
