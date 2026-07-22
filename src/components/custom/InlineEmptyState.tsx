import { LucideIcon } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface InlineEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Compact empty state for a single list section (e.g. inside a FlashList's
 * `ListEmptyComponent`) — no icon-circle background, unlike the fullscreen
 * `feed/EmptyState`, which is a different visual weight for a different
 * context. */
export function InlineEmptyState({
  icon,
  title,
  description,
}: InlineEmptyStateProps) {
  return (
    <VStack space="xs" className="items-center px-8 py-12">
      <Icon as={icon} size="xl" className="text-muted-foreground" />
      <Text className="text-base font-semibold text-foreground">{title}</Text>
      <Text className="text-center text-sm text-muted-foreground">
        {description}
      </Text>
    </VStack>
  );
}
