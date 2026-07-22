import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";

/** Shared primary submit button for the `(auth)` screens: a `variant="theme"`
 * button that swaps its trailing chevron for a spinner while loading. */
function AuthSubmitButton({
  isLoading = false,
  label,
  onPress,
  disabled = false,
}: {
  isLoading?: boolean;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      size="xl"
      variant="theme"
      onPress={onPress}
      disabled={disabled}
      className="gap-1"
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <ButtonText>{label}</ButtonText>
      {isLoading ? (
        <ButtonSpinner color="white" />
      ) : (
        <Icon as={ChevronRightIcon} className="text-white stroke-2" />
      )}
    </Button>
  );
}

export default AuthSubmitButton;
