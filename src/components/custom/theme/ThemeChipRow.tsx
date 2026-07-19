import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export interface ThemeChipOption {
  id: string;
  labelKey: string;
  accentClassName: string;
}

interface ThemeChipRowProps {
  label: string;
  options: ThemeChipOption[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  getLabel: (labelKey: string) => string;
  /** Renders a leading color dot on every chip — used to mark the primary
   * (category) row so it reads as one level up from the plain-text
   * subcategory row beneath it. */
  showDot?: boolean;
  /** When set, prepends a chip that clears the selection back to `null`. */
  clearLabel?: string;
}

export function ThemeChipRow({
  label,
  options,
  selectedId,
  onSelect,
  getLabel,
  showDot = false,
  clearLabel,
}: ThemeChipRowProps) {
  const clearAccent = options[0]?.accentClassName ?? "bg-theme";

  return (
    <VStack space="xs">
      <Text className="px-4 font-baloo-bold text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-4 py-1"
      >
        {clearLabel && (
          <Pressable
            onPress={() => onSelect(null)}
            accessibilityRole="button"
            accessibilityState={{ selected: !selectedId }}
            accessibilityLabel={clearLabel}
            className={`rounded-full border px-4 py-2 active:opacity-75 ${
              !selectedId
                ? `border-0 ${clearAccent}`
                : "border-border bg-input/20"
            }`}
          >
            <Text
              className={`font-baloo-semibold text-xs ${
                !selectedId ? "text-white" : "text-muted-foreground"
              }`}
            >
              {clearLabel}
            </Text>
          </Pressable>
        )}
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={getLabel(option.labelKey)}
              className={`flex-row items-center gap-1.5 rounded-full border px-4 py-2 active:opacity-75 ${
                isSelected
                  ? `border-0 ${option.accentClassName}`
                  : "border-border bg-input/20"
              }`}
            >
              {showDot && (
                <Box
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected ? "bg-white" : option.accentClassName
                  }`}
                />
              )}
              <Text
                className={`font-baloo-semibold text-xs ${
                  isSelected ? "text-white" : "text-muted-foreground"
                }`}
              >
                {getLabel(option.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </VStack>
  );
}
