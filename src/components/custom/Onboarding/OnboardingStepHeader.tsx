import { useTranslation } from "react-i18next";

import { ChevronLeftIcon, Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";

type OnboardingStepHeaderProps = {
  step: number;
  totalSteps: number;
  onBack?: () => void;
};

export function OnboardingStepHeader({
  step,
  totalSteps,
  onBack,
}: OnboardingStepHeaderProps) {
  const { t } = useTranslation();

  return (
    <HStack className="w-full items-center justify-between">
      <Pressable
        onPress={onBack}
        disabled={!onBack}
        accessibilityRole="button"
        accessibilityLabel={t("common.go_back")}
        className={onBack ? "active:opacity-70" : "opacity-0"}
      >
        <HStack className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <Icon as={ChevronLeftIcon} size="md" className="text-foreground" />
        </HStack>
      </Pressable>

      <HStack space="xs" className="items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <VStack
            key={index}
            className={
              index === step - 1
                ? "h-1.5 w-6 rounded-full bg-theme"
                : "h-1.5 w-1.5 rounded-full bg-border"
            }
          />
        ))}
      </HStack>

      <VStack className="h-10 w-10" />
    </HStack>
  );
}
