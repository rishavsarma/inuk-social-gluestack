import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import { ROUTES } from "@/routes";

/** Shared "back to login" link used across the `(auth)` screens — always
 * replaces the stack with the auth home screen. */
function BackToLoginButton({ disabled = false }: { disabled?: boolean }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Button
      variant="link"
      size="default"
      onPress={() => router.replace(ROUTES.AUTH.HOME)}
      className="p-0"
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={t("auth.back_to_login")}
      accessibilityState={{ disabled }}
    >
      <ButtonIcon as={ArrowLeft} />
      <ButtonText>{t("auth.back_to_login")}</ButtonText>
    </Button>
  );
}

export default BackToLoginButton;
