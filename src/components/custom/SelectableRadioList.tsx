import React from "react";

import { CircleIcon } from "@/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

interface SelectableRadioListItem<T extends string> {
  id: T;
  label: string;
}

interface SelectableRadioListProps<T extends string> {
  items: SelectableRadioListItem<T>[];
  value: T;
  onChange: (id: T) => void;
  renderLeading?: (id: T) => React.ReactNode;
}

function SelectableRadioList<T extends string>({
  items,
  value,
  onChange,
  renderLeading,
}: SelectableRadioListProps<T>) {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <VStack space="md" className="w-full">
        {items.map((item) => {
          const isSelected = item.id === value;
          const leading = renderLeading?.(item.id);
          return (
            <Radio
              key={item.id}
              value={item.id}
              size="md"
              className={
                "w-full flex-row-reverse items-center justify-between rounded-lg border px-4 py-4 active:opacity-70 " +
                (isSelected
                  ? "border-theme bg-theme/10"
                  : "border-border bg-card")
              }
            >
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              {leading ? (
                <HStack space="md" className="flex-1 items-center">
                  {leading}
                  <RadioLabel className="flex-1 text-lg font-semibold text-foreground font-baloo-semibold">
                    {item.label}
                  </RadioLabel>
                </HStack>
              ) : (
                <RadioLabel className="flex-1 text-lg font-semibold text-foreground font-baloo-semibold">
                  {item.label}
                </RadioLabel>
              )}
            </Radio>
          );
        })}
      </VStack>
    </RadioGroup>
  );
}

export { SelectableRadioList };
