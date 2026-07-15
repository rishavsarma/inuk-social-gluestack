import React from "react";

import { BadgeCheck, CheckCircle2, Circle, Mail, Smartphone } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { SettingsRow } from "@/components/custom/settings/SettingsRow";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { useAccountSettingsStore } from "@/stores/accountSettings.store";

const VerificationScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const idVerificationStatus = useAccountSettingsStore(
    (state) => state.idVerificationStatus,
  );
  const setIdVerificationStatus = useAccountSettingsStore(
    (state) => state.setIdVerificationStatus,
  );

  const hasMobile = !!user?.mobile;
  const hasEmail = !!user?.email;

  const showToast = (message: string) => {
    toast.show({
      placement: "top",
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      ),
    });
  };

  const handleIdPress = () => {
    if (idVerificationStatus === "not_submitted") {
      setIdVerificationStatus("pending");
      showToast(t("verification.id_submitted_toast"));
      return;
    }
    if (idVerificationStatus === "pending") {
      showToast(t("verification.id_pending_toast"));
    }
  };

  const idSubtitle =
    idVerificationStatus === "verified"
      ? t("verification.id_status_verified")
      : idVerificationStatus === "pending"
        ? t("verification.id_status_pending")
        : t("verification.id_status_not_submitted");

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("profile_bottom_sheet.verification")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="sm" className="bg-background">
        <Text size="sm" className="px-4 pt-4 text-muted-foreground">
          {t("verification.intro")}
        </Text>

        <VStack space="xs" className="bg-card">
          <SettingsRow
            icon={Smartphone}
            tint="blue"
            title={t("verification.mobile_verified")}
            subtitle={user?.mobile || undefined}
            rightElement={
              <Icon
                as={hasMobile ? CheckCircle2 : Circle}
                size="sm"
                className={hasMobile ? "text-green-500" : "text-muted-foreground"}
              />
            }
          />
          <SettingsRow
            icon={Mail}
            tint="indigo"
            title={t("verification.email_verified")}
            subtitle={user?.email || t("verification.email_not_added")}
            onPress={
              hasEmail ? undefined : () => router.push(ROUTES.USER.EDIT_PROFILE)
            }
            rightElement={
              <Icon
                as={hasEmail ? CheckCircle2 : Circle}
                size="sm"
                className={hasEmail ? "text-green-500" : "text-muted-foreground"}
              />
            }
          />
          <SettingsRow
            icon={BadgeCheck}
            tint="green"
            title={t("verification.government_id")}
            subtitle={idSubtitle}
            onPress={idVerificationStatus === "verified" ? undefined : handleIdPress}
          />
        </VStack>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default VerificationScreen;
