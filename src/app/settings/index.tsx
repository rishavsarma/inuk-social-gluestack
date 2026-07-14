import React, { useState } from "react";

import Constants from "expo-constants";
import { Image } from "expo-image";
import { router } from "expo-router";

import {
  Bell,
  ChevronRight,
  CircleHelp,
  Eye,
  FileText,
  Globe,
  Moon,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import switchTheme from "react-native-theme-switch-animation";

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { CircleIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useAuthStore } from "@/stores/auth.store";
import { useSettingStore } from "@/stores/setting.store";

import { useGetProfile, useUpdateProfile } from "@/hooks/useProfile";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

import { LANGUAGES, MENU_ROW_TINTS, THEME_ACCENT_COLOR } from "@/constants";

import { ROUTES } from "@/routes";

// ─── One settings row: pastel icon circle, title/subtitle, chevron/switch ──
interface SettingsRowProps {
  icon: React.ComponentType<any>;
  tint: keyof typeof MENU_ROW_TINTS;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

function SettingsRow({
  icon,
  tint,
  title,
  subtitle,
  onPress,
  rightElement,
  destructive = false,
}: SettingsRowProps) {
  const { iconBg, iconColor } = MENU_ROW_TINTS[tint];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
      className={onPress ? "active:opacity-70" : undefined}
    >
      <HStack space="sm" className="items-center px-4 py-2.5">
        <Box className={`p-2 items-center justify-center rounded-full ${iconBg}`}>
          <Icon as={icon} size="sm" className={iconColor} />
        </Box>
        <VStack className="flex-1">
          <Text
            size="sm"
            className={`font-semibold ${
              destructive ? "text-red-500" : "text-foreground"
            }`}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              size="xs"
              className={` ${
                destructive ? "text-red-400" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </Text>
          ) : null}
        </VStack>
        {rightElement ??
          (onPress ? (
            <Icon
              as={ChevronRight}
              size="sm"
              className="text-muted-foreground"
            />
          ) : null)}
      </HStack>
    </Pressable>
  );
}

// ─── Uppercase section label ────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <Box className="px-4 pt-4">
      <Text
        size="sm"
        className="font-semibold capitalize  text-muted-foreground"
      >
        {title}
      </Text>
    </Box>
  );
}

// ─── Profile summary row at the top ────────────────────────────────────
function ProfileSummary() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const profileId = user?.profileId || "";
  const { data: profileData, isLoading } = useGetProfile(profileId);
  const profile = profileData?.profile;

  if (isLoading || !profile) {
    return (
      <HStack space="md" className="items-center px-4 py-3">
        <Skeleton className="h-14 w-14 rounded-full" />
        <VStack space="xs" className="flex-1">
          <SkeletonText className="h-4 w-36" />
          <SkeletonText className="h-3 w-24" />
        </VStack>
      </HStack>
    );
  }

  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Pressable
      onPress={() => router.push(ROUTES.USER.EDIT_PROFILE)}
      accessibilityRole="button"
      accessibilityLabel={t("profile_bottom_sheet.edit_profile")}
      className="bg-card"
    >
      <HStack space="md" className="items-center px-4 py-3">
        <Box className="h-14 w-14 overflow-hidden rounded-full bg-muted">
          <Image
            source={`${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${profile.avatar}/jpeg/720`}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            accessibilityLabel={t("profile.avatar")}
          />
        </Box>
        <VStack space="2xs" className="flex-1">
          <Text size="md" className=" font-bold text-foreground">
            {fullName}
          </Text>
          <Text size="sm" className=" text-muted-foreground">
            @{profile.username}
          </Text>
        </VStack>
        <Icon as={ChevronRight} size="sm" className="text-muted-foreground" />
      </HStack>
    </Pressable>
  );
}

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const profileId = user?.profileId || "";

  const { theme, setTheme, language, setLanguage } = useSettingStore();
  const pushNotificationsEnabled = useSettingStore(
    (state) => state.pushNotificationsEnabled,
  );
  const setPushNotificationsEnabled = useSettingStore(
    (state) => state.setPushNotificationsEnabled,
  );
  const votingAlertsEnabled = useSettingStore(
    (state) => state.votingAlertsEnabled,
  );
  const setVotingAlertsEnabled = useSettingStore(
    (state) => state.setVotingAlertsEnabled,
  );

  const { data: profileData } = useGetProfile(profileId);
  const { mutate: updateProfile } = useUpdateProfile(profileId);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [tempLanguage, setTempLanguage] = useState(language);
  const [publicOverride, setPublicOverride] = useState<boolean | null>(null);

  const systemColorScheme = useColorScheme();
  const isDark = (theme === "system" ? systemColorScheme : theme) === "dark";

  const isPublicProfile =
    publicOverride ?? profileData?.profile?.visibility !== "PRIVATE";

  const selectedLanguage =
    LANGUAGES.find((item) => item.id === language) || LANGUAGES[0];

  const appVersion = Constants.expoConfig?.version ?? t("common.not_available");

  const switchColors = { true: THEME_ACCENT_COLOR };

  const handleToggleDarkMode = (value: boolean) => {
    switchTheme({
      switchThemeFunction: () => {
        setTheme(value ? "dark" : "light");
      },
    });
  };

  const handleTogglePublicProfile = (value: boolean) => {
    setPublicOverride(value);
    updateProfile({ visibility: value ? "PUBLIC" : "PRIVATE" });
  };

  const handleSaveLanguage = () => {
    setShowLanguageSheet(false);
    if (tempLanguage === language) return;
    setLanguage(tempLanguage);
    i18n.changeLanguage(tempLanguage);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("settings.title")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="sm" className=" bg-background">
        {/* Account */}
        <VStack space="xs" className=" bg-card">
          <SectionHeader title={t("settings.account")} />
          <SettingsRow
            icon={Shield}
            tint="green"
            title={t("settings.privacy")}
            subtitle={t("settings.privacy_sub")}
            onPress={() => router.push(ROUTES.USER.EDIT_PROFILE)}
          />
          <SettingsRow
            icon={Eye}
            tint="indigo"
            title={t("settings.public_profile")}
            subtitle={t("settings.public_profile_sub")}
            rightElement={
              <Switch
                value={isPublicProfile}
                onValueChange={handleTogglePublicProfile}
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("settings.public_profile")}
              />
            }
          />
        </VStack>
        {/* Notifications */}
        <VStack space="xs" className=" bg-card">
          <SectionHeader title={t("settings.notifications")} />
          <SettingsRow
            icon={Bell}
            tint="amber"
            title={t("settings.push_notifications")}
            subtitle={t("settings.push_notifications_sub")}
            rightElement={
              <Switch
                value={pushNotificationsEnabled}
                onValueChange={setPushNotificationsEnabled}
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("settings.push_notifications")}
              />
            }
          />
          <SettingsRow
            icon={SlidersHorizontal}
            tint="violet"
            title={t("settings.voting_alerts")}
            subtitle={t("settings.voting_alerts_sub")}
            rightElement={
              <Switch
                value={votingAlertsEnabled}
                onValueChange={setVotingAlertsEnabled}
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("settings.voting_alerts")}
              />
            }
          />
        </VStack>
        {/* Appearance */}
        <VStack space="xs" className=" bg-card">
          <SectionHeader title={t("settings.appearance")} />
          <SettingsRow
            icon={Moon}
            tint="violet"
            title={t("settings.dark_mode")}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={handleToggleDarkMode}
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("settings.dark_mode")}
              />
            }
          />
          <SettingsRow
            icon={Globe}
            tint="cyan"
            title={t("settings.language")}
            subtitle={t(selectedLanguage.labelKey)}
            onPress={() => {
              setTempLanguage(language);
              setShowLanguageSheet(true);
            }}
          />
        </VStack>

        {/* Support */}
        <VStack space="xs" className=" bg-card">
          <SectionHeader title={t("settings.support")} />
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
            rightElement={
              <Icon
                as={ChevronRight}
                size="sm"
                className="text-muted-foreground"
              />
            }
          />
        </VStack>

        {/* Legal */}
        <VStack space="xs" className=" bg-card">
          <SectionHeader title={t("settings.legal")} />
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

      {/* Language picker */}
      <Actionsheet
        isOpen={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="px-6 py-6 pb-safe">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <VStack space="lg" className="mt-4 w-full">
            <Text className="text-lg font-bold text-foreground">
              {t("settings.select_language")}
            </Text>

            <RadioGroup value={tempLanguage} onChange={setTempLanguage}>
              <VStack space="md" className="w-full">
                {LANGUAGES.map((item) => (
                  <Radio
                    key={item.id}
                    value={item.id}
                    size="md"
                    className="w-full flex-row-reverse justify-between py-2"
                  >
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel className="text-base font-normal text-foreground">
                      {t(item.labelKey)}
                    </RadioLabel>
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>

            <Button
              onPress={handleSaveLanguage}
              size="lg"
              variant="default"
              className="mt-2 w-full rounded-full"
              accessibilityRole="button"
              accessibilityLabel={t("settings.save_preference")}
            >
              <ButtonText>{t("settings.save_preference")}</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>

      {/* Logout confirmation */}
      <AlertDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md" className="text-foreground">
              {t("profile_bottom_sheet.log_out")}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-muted-foreground">
              {t("profile_bottom_sheet.confirm_logout")}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onPress={() => setShowLogoutConfirm(false)}
              accessibilityRole="button"
              accessibilityLabel={t("profile_bottom_sheet.cancel")}
            >
              <ButtonText>{t("profile_bottom_sheet.cancel")}</ButtonText>
            </Button>
            <Button
              variant="destructive"
              onPress={handleConfirmLogout}
              accessibilityRole="button"
              accessibilityLabel={t("profile_bottom_sheet.log_out")}
              accessibilityHint={t("profile_bottom_sheet.confirm_logout")}
            >
              <ButtonText>{t("profile_bottom_sheet.log_out")}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </KeyboardAvoidingScrollView>
  );
};

export default SettingsScreen;
