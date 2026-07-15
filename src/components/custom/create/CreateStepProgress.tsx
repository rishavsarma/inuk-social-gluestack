import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

interface CreateStepProgressProps {
  currentStep: number;
  totalSteps: number;
  caption: string;
}

export function CreateStepProgress({
  currentStep,
  totalSteps,
  caption,
}: CreateStepProgressProps) {
  return (
    <Box className="px-4 py-2">
      <HStack space="xs" className="mb-2" accessibilityElementsHidden>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <Box
            key={step}
            className="h-1 flex-1 overflow-hidden rounded-full bg-border"
          >
            <Box
              className={
                step <= currentStep
                  ? "h-full w-full rounded-full bg-theme"
                  : "h-full w-0 rounded-full bg-theme"
              }
            />
          </Box>
        ))}
      </HStack>
      {/* <Text size="xs" className="font-semibold text-muted-foreground">
        {caption}
      </Text> */}
    </Box>
  );
}
