import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { UserPlus } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface FollowButtonProps {
  isFollowing: boolean;
  isFollowLoading?: boolean;
  displayName: string;
  onPress?: () => void;
  size?: "sm" | "md";
  /**
   * "overlay" renders white icon/text (for use on top of a photo/video) and
   * shows a spinner while loading. "default" uses the button's normal
   * variant colors and just disables the button while loading.
   */
  variant?: "overlay" | "default";
  /** Use the "outline" button variant once already following, instead of the solid theme color. */
  outlineWhenFollowing?: boolean;
  /** Always swap the label for a ButtonSpinner while loading, regardless of `variant`. */
  showSpinnerWhenLoading?: boolean;
  /** Set false to render text-only, with no leading UserPlus icon. */
  showIcon?: boolean;
  className?: string;
}

export function FollowButton({
  isFollowing,
  isFollowLoading,
  displayName,
  onPress,
  size = "md",
  variant = "overlay",
  outlineWhenFollowing = false,
  showSpinnerWhenLoading,
  showIcon = true,
  className,
}: FollowButtonProps) {
  const { t } = useTranslation();
  const isOverlay = variant === "overlay";
  const shouldShowSpinner = showSpinnerWhenLoading ?? isOverlay;

  return (
    <Button
      variant={outlineWhenFollowing && isFollowing ? "outline" : "theme"}
      size={size === "sm" ? "sm" : "default"}
      className={`rounded-full${className ? ` ${className}` : ""}`}
      onPress={onPress}
      disabled={isFollowLoading}
      accessibilityRole="button"
      accessibilityLabel={
        isFollowing
          ? t("network.unfollow_a11y", { name: displayName })
          : t("network.follow_a11y", { name: displayName })
      }
    >
      {shouldShowSpinner && isFollowLoading ? (
        <ButtonSpinner color={isFollowing ? undefined : isOverlay ? "white" : undefined} />
      ) : (
        <>
          {showIcon && (
            <ButtonIcon
              as={UserPlus}
              className={isOverlay && !isFollowing ? "text-white" : ""}
            />
          )}
          <ButtonText
            className={isOverlay && !isFollowing ? "text-white" : ""}
          >
            {isFollowing ? t("network.following_btn") : t("network.follow")}
          </ButtonText>
        </>
      )}
    </Button>
  );
}
