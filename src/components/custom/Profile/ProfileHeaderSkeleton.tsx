import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import React from "react";

function ProfileHeaderSkeleton() {
  return (
    <VStack space="sm">
      <Box className="relative h-64 w-full bg-muted">
        <Skeleton className="h-full w-full" />
      </Box>
      <HStack className="px-4">
        <Box className="-mt-12">
          <Skeleton
            variant="circular"
            className="h-28 w-28 border-4 border-background"
          />
        </Box>
        <HStack className="flex-1 items-center justify-around">
          <VStack space="xs" className="items-center">
            <Skeleton variant="rounded" className="h-4 w-8" />
            <Skeleton variant="rounded" className="h-3 w-10" />
          </VStack>
          <VStack space="xs" className="items-center">
            <Skeleton variant="rounded" className="h-4 w-8" />
            <Skeleton variant="rounded" className="h-3 w-14" />
          </VStack>
          <VStack space="xs" className="items-center">
            <Skeleton variant="rounded" className="h-4 w-8" />
            <Skeleton variant="rounded" className="h-3 w-14" />
          </VStack>
        </HStack>
      </HStack>
      <VStack space="xs" className="px-4">
        <Skeleton variant="rounded" className="h-5 w-40" />
        <SkeletonText _lines={2} gap={1} className="h-2 w-3/4" />
      </VStack>
      <HStack space="sm" className="px-4 pt-2">
        <Skeleton variant="rounded" className="h-6 w-6 flex-1" />
        <Skeleton variant="rounded" className="h-6 w-6 flex-1" />
        <Skeleton variant="rounded" className="h-6 w-6 flex-1" />
        <Skeleton variant="rounded" className="h-6 w-6 flex-1" />
      </HStack>
      <HStack className="flex-wrap">
        {Array.from({ length: 9 }).map((_, index) => (
          <Box key={index} className="aspect-square w-1/3 p-px">
            <Skeleton variant="sharp" className="h-full w-full" />
          </Box>
        ))}
      </HStack>
    </VStack>
  );
}

export default ProfileHeaderSkeleton;
