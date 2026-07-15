import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { THEME_RGB } from '@/constants';
import { LucideIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  fullScreen?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  fullScreen = true,
}: EmptyStateProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark
    ? THEME_RGB.dark.mutedForeground
    : THEME_RGB.light.mutedForeground;

  return (
    <View
      className={`items-center justify-center px-8 ${
        fullScreen ? 'flex-1 py-20' : 'py-12'
      }`}>
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-secondary/50 dark:bg-secondary/30">
        <Icon size={40} color={iconColor} strokeWidth={1.5} />
      </View>
      
      <Text className="mb-2 text-center text-xl font-bold tracking-tight text-foreground">
        {title}
      </Text>
      
      <Text className="mb-8 text-center text-sm text-muted-foreground leading-relaxed">
        {description}
      </Text>
      
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="lg"
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          className="min-w-[160px] rounded-full border-border/50">
          <Text className="font-semibold text-foreground">{actionLabel}</Text>
        </Button>
      )}
    </View>
  );
}
