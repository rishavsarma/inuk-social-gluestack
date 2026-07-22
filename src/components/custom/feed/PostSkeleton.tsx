import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';
import { Dimensions, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Card width and media height matched with post logic
const cardWidth = SCREEN_WIDTH;
const mediaHeight = SCREEN_WIDTH * 1.25;

export function PostSkeleton() {
  return (
    <View className="mb-2 overflow-hidden bg-card">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </View>
        <View className="h-8 w-8 items-center justify-center">
          <Skeleton className="h-1 w-4 rounded-full" />
        </View>
      </View>

      {/* Caption */}
      <View className="gap-2 px-4 pb-2">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
      </View>

      {/* Media Block */}
      <View style={{ width: cardWidth, height: mediaHeight }} className="self-center">
        <Skeleton className="h-full w-full" />

        {/* Action Bar Overlay Skeleton */}
        <View
          style={{ position: 'absolute', bottom: 16, left: 0, right: 0, alignItems: 'center' }}
          pointerEvents="none">
          <View className="flex-row items-center justify-center gap-4 rounded-full border border-white/10 bg-black/20 px-4 py-2">
            {/* Like */}
            <View className="flex-row items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full bg-white/30" />
              <Skeleton className="h-3 w-6 rounded bg-white/30" />
            </View>
            <View className="h-3 w-[1px] bg-white/20" />
            {/* Comment */}
            <View className="flex-row items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full bg-white/30" />
              <Skeleton className="h-3 w-6 rounded bg-white/30" />
            </View>
            <View className="h-3 w-[1px] bg-white/20" />
            {/* Share */}
            <Skeleton className="h-5 w-5 rounded-full bg-white/30" />
          </View>
        </View>
      </View>
    </View>
  );
}
