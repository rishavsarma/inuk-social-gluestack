import React, { useState } from "react";

import {
  ChevronRight,
  Copy,
  Gift,
  KeyRound,
  LogOut,
  Settings,
  Share2,
  Star,
  User,
} from "lucide-react-native";
import { Share } from "react-native";
import { useTranslation } from "react-i18next";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { useGetProfile } from "@/hooks/useProfile";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";

// ─── One menu row: pastel icon circle, title/subtitle, chevron ─────────
interface MenuRowProps {
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBgClassName: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuRow({
  icon,
  iconColor,
  iconBgClassName,
  title,
  subtitle,
  onPress,
  destructive = false,
}: MenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      className="active:opacity-70"
    >
      <HStack space="sm" className="items-center px-4 py-2.5">
        <Box
          className={`p-2 items-center justify-center rounded-full ${iconBgClassName}`}
        >
          <Icon as={icon} size="sm" color={iconColor} />
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
              className={destructive ? "text-red-400" : "text-muted-foreground"}
            >
              {subtitle}
            </Text>
          ) : null}
        </VStack>
        <Icon as={ChevronRight} size="sm" className="text-muted-foreground" />
      </HStack>
    </Pressable>
  );
}

const ProfileMenuScreen = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toast = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { data: profileData } = useGetProfile(user?.profileId || "");
  const referral = profileData?.profile?.referralCode;

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

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("profile_bottom_sheet.account_menu")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="sm" className=" bg-background">
        <Box className="">
          <HStack
            space="md"
            className="w-full items-center rounded-lg bg-card p-4 dark:bg-card/90"
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

        <VStack space="xs" className="bg-card">
          <MenuRow
            icon={User}
            iconColor="#3B82F6"
            iconBgClassName="bg-blue-500/10 dark:bg-blue-500/20"
            title={t("profile_bottom_sheet.edit_profile")}
            subtitle={t("profile_bottom_sheet.update_name_avatar")}
            onPress={() => router.push(ROUTES.USER.EDIT_PROFILE)}
          />
          <MenuRow
            icon={Settings}
            iconColor="#64748B"
            iconBgClassName="bg-slate-500/10 dark:bg-slate-500/20"
            title={t("profile_bottom_sheet.settings")}
            subtitle={t("profile_bottom_sheet.preferences_controls")}
            onPress={() => router.push(ROUTES.USER.SETTINGS)}
          />
          <MenuRow
            icon={Star}
            iconColor="#F59E0B"
            iconBgClassName="bg-amber-500/10 dark:bg-amber-500/20"
            title={t("profile_bottom_sheet.sparks_coins")}
            subtitle={t("profile_bottom_sheet.view_points_history")}
            onPress={() => router.push(ROUTES.USER.POINTS)}
          />
          <MenuRow
            icon={KeyRound}
            iconColor="#8B5CF6"
            iconBgClassName="bg-violet-500/10 dark:bg-violet-500/20"
            title={t("profile_bottom_sheet.change_password")}
            subtitle={t("profile_bottom_sheet.change_password_sub")}
            onPress={() => router.push(ROUTES.USER.CHANGE_PASSWORD)}
          />
          <MenuRow
            icon={LogOut}
            iconColor="#EF4444"
            iconBgClassName="bg-red-500/10 dark:bg-red-500/20"
            title={t("profile_bottom_sheet.log_out")}
            subtitle={t("profile_bottom_sheet.sign_out_app")}
            onPress={() => setShowLogoutConfirm(true)}
            destructive
          />
        </VStack>
      </VStack>

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

export default ProfileMenuScreen;
