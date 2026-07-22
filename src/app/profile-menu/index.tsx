import React, { useEffect, useState } from "react";

import Constants from "expo-constants";
import { router } from "expo-router";
import { getAppIcon, setAppIcon } from "expo-dynamic-app-icon";
import {
  Ban,
  Bell,
  Copy,
  CircleHelp,
  Crown,
  FileText,
  Gift,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  Moon,
  Share2,
  ShieldCheck,
  Smartphone,
  User,
} from "lucide-react-native";
import { Share } from "react-native";
import { useTranslation } from "react-i18next";
import * as Clipboard from "expo-clipboard";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { ConfirmAlertDialog } from "@/components/custom/ConfirmAlertDialog";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import {
  SettingsRow,
  SettingsSectionHeader,
} from "@/components/custom/settings/SettingsRow";
import { LANGUAGES, THEMES } from "@/constants";
import { useFeedbackToast } from "@/hooks/useFeedbackToast";
import { useGetProfile } from "@/hooks/useProfile";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { useSettingStore } from "@/stores/setting.store";

const ProfileMenuScreen = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toast = useToast();
  const showFeedbackToast = useFeedbackToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const theme = useSettingStore((state) => state.theme);
  const language = useSettingStore((state) => state.language);
  const isProMember = useSettingStore((state) => state.isProMember);
  const setIsProMember = useSettingStore((state) => state.setIsProMember);

  const { data: profileData } = useGetProfile(user?.profileId || "");
  const referral = profileData?.profile?.referralCode;

  useEffect(() => {
    try {
      setIsProMember(getAppIcon() === "pro");
    } catch {
      // native module unavailable (e.g. Expo Go) — leave persisted state as-is
    }
  }, [setIsProMember]);

  const selectedLanguage =
    LANGUAGES.find((item) => item.id === language) || LANGUAGES[0];
  const selectedTheme = THEMES.find((item) => item.id === theme) || THEMES[0];
  const appVersion = Constants.expoConfig?.version ?? t("common.not_available");

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const handleCopyReferral = async () => {
    if (!referral) return;
    await Clipboard.setStringAsync(referral);
    toast.show({
      placement: "top",
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="success" variant="solid">
          <ToastDescription>
            {t("profile.referral_copied", { code: referral })}
          </ToastDescription>
        </Toast>
      ),
    });
  };

  const handleShareReferral = async () => {
    if (!referral) return;
    try {
      await Share.share({
        message: t("profile.share_message", { code: referral }),
      });
    } catch {
      // user dismissed the share sheet — nothing to do
    }
  };

  const handleToggleProMembership = () => {
    const nextIsProMember = !isProMember;
    try {
      // "" (not "DEFAULT") is the sentinel this module treats as "reset to
      // the primary icon" — see patches/expo-dynamic-app-icon+1.2.0.patch.
      const result = setAppIcon(nextIsProMember ? "pro" : "");
      if (result === false) throw new Error("setAppIcon failed");
      setIsProMember(nextIsProMember);
      showFeedbackToast(
        nextIsProMember
          ? t("settings.pro_icon_applied")
          : t("settings.pro_icon_reverted"),
        "bottom",
      );
    } catch {
      showFeedbackToast(t("settings.pro_icon_error"), "bottom");
    }
  };

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("profile_bottom_sheet.account_menu")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="sm" className="bg-background">
        <Box>
          <HStack
            space="md"
            className="w-full items-center rounded-none bg-card p-4 dark:bg-card/90"
          >
            <Box className="p-4 items-center justify-center rounded-2xl bg-theme/15">
              <Icon as={Gift} size="xl" className="text-theme" />
            </Box>
            <VStack className="flex-1">
              <Text size="sm" bold className="text-foreground">
                {t("profile_bottom_sheet.refer_earn")}
              </Text>
              <HStack space="xs" className="mt-1 items-center">
                <Text size="xs" className="text-muted-foreground">
                  {t("profile_bottom_sheet.code")}
                </Text>
                <Badge
                  variant="outline"
                  className="rounded-full border-theme/20 bg-theme/10"
                >
                  <BadgeText className="font-bold uppercase tracking-widest text-theme">
                    {referral || t("common.not_available")}
                  </BadgeText>
                </Badge>
              </HStack>
            </VStack>
            <Button
              variant="secondary"
              size="icon"
              onPress={handleCopyReferral}
              accessibilityRole="button"
              accessibilityLabel={t("profile_bottom_sheet.copy_code")}
              className="h-11 w-11 rounded-full"
            >
              <ButtonIcon as={Copy} size="lg" />
            </Button>
            <Button
              size="icon"
              onPress={handleShareReferral}
              accessibilityRole="button"
              accessibilityLabel={t("profile_bottom_sheet.share_code")}
              className="h-11 w-11 rounded-full bg-theme data-[active=true]:bg-theme/80"
            >
              <ButtonIcon as={Share2} size="lg" className="text-white" />
            </Button>
          </HStack>
        </Box>

        {/* Primary settings list */}
        <VStack space="xs" className="bg-card">
          <SettingsRow
            icon={User}
            tint="blue"
            title={t("profile_bottom_sheet.account")}
            subtitle={t("profile_bottom_sheet.account_sub")}
            onPress={() => router.push(ROUTES.USER.EDIT_PROFILE)}
          />
          <SettingsRow
            icon={ShieldCheck}
            tint="green"
            title={t("profile_bottom_sheet.verification")}
            subtitle={t("profile_bottom_sheet.verification_sub")}
            onPress={() => router.push(ROUTES.USER.VERIFICATION)}
          />
          <SettingsRow
            icon={Lock}
            tint="indigo"
            title={t("settings.privacy")}
            subtitle={t("settings.privacy_sub")}
            onPress={() => router.push(ROUTES.USER.PRIVACY)}
          />
          <SettingsRow
            icon={Bell}
            tint="amber"
            title={t("settings.notifications")}
            subtitle={t("profile_bottom_sheet.notifications_sub")}
            onPress={() => router.push(ROUTES.USER.NOTIFICATION_PREFS)}
          />
          <SettingsRow
            icon={Ban}
            tint="slate"
            title={t("profile_bottom_sheet.blocked_muted")}
            subtitle={t("profile_bottom_sheet.blocked_muted_sub")}
            onPress={() => router.push(ROUTES.USER.BLOCKED)}
          />
          <SettingsRow
            icon={Globe}
            tint="cyan"
            title={t("settings.language")}
            subtitle={t(selectedLanguage.labelKey)}
            onPress={() => router.push(ROUTES.USER.LANGUAGE)}
          />
          <SettingsRow
            icon={FileText}
            tint="slate"
            title={t("profile_bottom_sheet.data_privacy")}
            subtitle={t("profile_bottom_sheet.data_privacy_sub")}
            onPress={() => router.push(ROUTES.USER.DATA_PRIVACY)}
          />
          <SettingsRow
            icon={LogOut}
            tint="red"
            title={t("profile_bottom_sheet.log_out")}
            subtitle={t("profile_bottom_sheet.sign_out_app")}
            onPress={() => setShowLogoutConfirm(true)}
            destructive
          />
        </VStack>

        {/* More — account/app features not covered by the list above */}
        <VStack space="xs" className="bg-card">
          <SettingsSectionHeader title={t("settings.more")} />
          <SettingsRow
            icon={KeyRound}
            tint="violet"
            title={t("profile_bottom_sheet.change_password")}
            subtitle={t("profile_bottom_sheet.change_password_sub")}
            onPress={() => router.push(ROUTES.USER.CHANGE_PASSWORD)}
          />
          <SettingsRow
            icon={Crown}
            tint="amber"
            title={
              isProMember
                ? t("settings.pro_member")
                : t("settings.upgrade_to_pro")
            }
            subtitle={
              isProMember
                ? t("settings.pro_member_sub")
                : t("settings.upgrade_to_pro_sub")
            }
            onPress={handleToggleProMembership}
          />
          <SettingsRow
            icon={Moon}
            tint="violet"
            title={t("settings.theme")}
            subtitle={t(selectedTheme.labelKey)}
            onPress={() => router.push(ROUTES.USER.THEME)}
          />
          <SettingsRow
            icon={CircleHelp}
            tint="slate"
            title={t("settings.help_faq")}
            onPress={() => {}}
          />
          <SettingsRow
            icon={Smartphone}
            tint="slate"
            title={t("settings.app_version")}
            subtitle={appVersion}
          />
          <SettingsRow
            icon={FileText}
            tint="slate"
            title={t("settings.terms_of_service")}
            onPress={() => router.push(ROUTES.LEGAL.TERMS)}
          />
          <SettingsRow
            icon={ShieldCheck}
            tint="slate"
            title={t("settings.privacy_policy")}
            onPress={() => router.push(ROUTES.LEGAL.PRIVACY)}
          />
        </VStack>
      </VStack>

      {/* Logout confirmation */}
      <ConfirmAlertDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title={t("profile_bottom_sheet.log_out")}
        description={t("profile_bottom_sheet.confirm_logout")}
        cancelLabel={t("profile_bottom_sheet.cancel")}
        confirmLabel={t("profile_bottom_sheet.log_out")}
        onConfirm={handleConfirmLogout}
      />
    </KeyboardAvoidingScrollView>
  );
};

export default ProfileMenuScreen;
