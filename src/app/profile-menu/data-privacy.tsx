import React, { useState } from "react";

import { Download, Mail, PauseCircle, Sparkles, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import {
  SettingsRow,
  SettingsSectionHeader,
} from "@/components/custom/settings/SettingsRow";
import { THEME_ACCENT_COLOR } from "@/constants";
import { useAccountSettingsStore } from "@/stores/accountSettings.store";

type ConfirmKind = "deactivate" | "delete" | null;

const DataPrivacyScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);

  const aiStoryConsent = useAccountSettingsStore((s) => s.aiStoryConsent);
  const marketingConsent = useAccountSettingsStore((s) => s.marketingConsent);
  const setAiStoryConsent = useAccountSettingsStore((s) => s.setAiStoryConsent);
  const setMarketingConsent = useAccountSettingsStore(
    (s) => s.setMarketingConsent,
  );

  const switchColors = { true: THEME_ACCENT_COLOR };

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

  const handleDownloadData = () => {
    showToast(t("data_privacy.download_data_toast"));
  };

  const handleConfirm = () => {
    if (confirmKind === "deactivate") {
      showToast(t("data_privacy.deactivate_confirmed_toast"));
    } else if (confirmKind === "delete") {
      showToast(t("data_privacy.delete_confirmed_toast"));
    }
    setConfirmKind(null);
  };

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("profile_bottom_sheet.data_privacy")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="sm" className="bg-background">
        <Text size="sm" className="px-4 pt-4 text-muted-foreground">
          {t("data_privacy.intro")}
        </Text>

        <VStack space="xs" className="bg-card">
          <SettingsRow
            icon={Download}
            tint="blue"
            title={t("data_privacy.download_data")}
            subtitle={t("data_privacy.download_data_sub")}
            onPress={handleDownloadData}
          />
          <SettingsRow
            icon={PauseCircle}
            tint="amber"
            title={t("data_privacy.deactivate_account")}
            subtitle={t("data_privacy.deactivate_account_sub")}
            onPress={() => setConfirmKind("deactivate")}
          />
          <SettingsRow
            icon={Trash2}
            tint="red"
            title={t("data_privacy.delete_account")}
            subtitle={t("data_privacy.delete_account_sub")}
            onPress={() => setConfirmKind("delete")}
            destructive
          />
        </VStack>

        <VStack space="xs" className="bg-card">
          <SettingsSectionHeader title={t("data_privacy.consents_section")} />
          <SettingsRow
            icon={Sparkles}
            tint="violet"
            title={t("data_privacy.ai_story_consent")}
            rightElement={
              <Switch
                value={aiStoryConsent}
                onValueChange={setAiStoryConsent}
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("data_privacy.ai_story_consent")}
              />
            }
          />
          <SettingsRow
            icon={Mail}
            tint="slate"
            title={t("data_privacy.marketing_consent")}
            rightElement={
              <Switch
                value={marketingConsent}
                onValueChange={setMarketingConsent}
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("data_privacy.marketing_consent")}
              />
            }
          />
        </VStack>
      </VStack>

      <AlertDialog isOpen={confirmKind !== null} onClose={() => setConfirmKind(null)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md" className="text-foreground">
              {confirmKind === "deactivate"
                ? t("data_privacy.deactivate_account")
                : t("data_privacy.delete_account")}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-muted-foreground">
              {confirmKind === "deactivate"
                ? t("data_privacy.deactivate_confirm_body")
                : t("data_privacy.delete_confirm_body")}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onPress={() => setConfirmKind(null)}
              accessibilityRole="button"
              accessibilityLabel={t("profile_bottom_sheet.cancel")}
            >
              <ButtonText>{t("profile_bottom_sheet.cancel")}</ButtonText>
            </Button>
            <Button
              variant="destructive"
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel={
                confirmKind === "deactivate"
                  ? t("data_privacy.deactivate_account")
                  : t("data_privacy.delete_account")
              }
            >
              <ButtonText>
                {confirmKind === "deactivate"
                  ? t("data_privacy.deactivate_confirm_cta")
                  : t("data_privacy.delete_confirm_cta")}
              </ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </KeyboardAvoidingScrollView>
  );
};

export default DataPrivacyScreen;
