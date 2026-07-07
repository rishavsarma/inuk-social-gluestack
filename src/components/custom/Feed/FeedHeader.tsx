import CategoriesRail from '@/components/common/categories-rail';
import { Button, Icon } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAppTopInset } from '@/hooks/use-app-insets';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { BellIcon, SearchIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';

interface FeedHeaderProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export const FeedHeader = React.memo(({ activeCategory, setActiveCategory }: FeedHeaderProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topInset = useAppTopInset();

  return (
    <View className="pb-2" style={{ paddingTop: topInset - 10 }}>
      <View className="flex-row items-center justify-between px-2 py-2">
        <Image
          source={
            isDark
              ? require('@/assets/images/splash-dark.png')
              : require('@/assets/images/splash.png')
          }
          style={{ width: 140, height: 40 }}
          contentFit="contain"
        />

        <View className="flex-row items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => router.push(ROUTES.TABS.EXPLORE)}
            className="rounded-full">
            <Icon as={SearchIcon} className="size-5 text-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onPress={() => router.push(ROUTES.TABS.NOTIFICATIONS)}
            className="rounded-full">
            <Icon as={BellIcon} className="size-5 text-foreground" />
            <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-[1.5px] border-background bg-destructive" />
          </Button>
        </View>
      </View>

      <CategoriesRail
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setActiveCategory(cat);
        }}
      />
    </View>
  );
});
