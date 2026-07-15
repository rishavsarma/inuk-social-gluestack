import React, { useState } from "react";

import { Eye, MapPin, MessageSquare, Search, AtSign, FolderLock } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { CircleIcon } from "@/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import {
  SettingsRow,
  SettingsSectionHeader,
} from "@/components/custom/settings/SettingsRow";
import { THEME_ACCENT_COLOR } from "@/constants";
import { useGetProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import {
  AudienceOption,
  useAccountSettingsStore,
} from "@/stores/accountSettings.store";

const AUDIENCE_OPTIONS: AudienceOption[] = ["everyone", "following", "no_one"];

const PrivacyScreen = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const profileId = user?.profileId || "";
  const { data: profileData } = useGetProfile(profileId);
  const { mutate: updateProfile } = useUpdateProfile(profileId);
  const [publicOverride, setPublicOverride] = useState<boolean | null>(null);

  const commentAudience = useAccountSettingsStore((s) => s.commentAudience);
  const mentionAudience = useAccountSettingsStore((s) => s.mentionAudience);
  const showLocationOnPosts = useAccountSettingsStore(
    (s) => s.showLocationOnPosts,
  );
  const discoverableInSearch = useAccountSettingsStore(
    (s) => s.discoverableInSearch,
  );
  const keepCollectionsPrivate = useAccountSettingsStore(
    (s) => s.keepCollectionsPrivate,
  );
  const setCommentAudience = useAccountSettingsStore(
    (s) => s.setCommentAudience,
  );
  const setMentionAudience = useAccountSettingsStore(
    (s) => s.setMentionAudience,
  );
  const setShowLocationOnPosts = useAccountSettingsStore(
    (s) => s.setShowLocationOnPosts,
  );
  const setDiscoverableInSearch = useAccountSettingsStore(
    (s) => s.setDiscoverableInSearch,
  );
  const setKeepCollectionsPrivate = useAccountSettingsStore(
    (s) => s.setKeepCollectionsPrivate,
  );

  const [activeSheet, setActiveSheet] = useState<"comment" | "mention" | null>(
    null,
  );

  const isPublicProfile =
    publicOverride ?? profileData?.profile?.visibility !== "PRIVATE";

  const switchColors = { true: THEME_ACCENT_COLOR };

  const audienceLabel = (value: AudienceOption) =>
    t(`privacy_settings.audience_${value}`);

  const handleTogglePublicProfile = (value: boolean) => {
    setPublicOverride(value);
    updateProfile({ visibility: value ? "PUBLIC" : "PRIVATE" });
  };

  const activeAudienceValue =
    activeSheet === "comment"
      ? commentAudience
      : activeSheet === "mention"
        ? mentionAudience
        : "everyone";

  const handleSelectAudience = (value: AudienceOption) => {
    if (activeSheet === "comment") setCommentAudience(value);
    if (activeSheet === "mention") setMentionAudience(value);
    setActiveSheet(null);
  };

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("settings.privacy")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="sm" className="bg-background">
        <VStack space="xs" className="bg-card">
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

        <VStack space="xs" className="bg-card">
          <SettingsSectionHeader title={t("privacy_settings.who_can_section")} />
          <SettingsRow
            icon={MessageSquare}
            tint="blue"
            title={t("privacy_settings.comment_on_posts")}
            subtitle={audienceLabel(commentAudience)}
            onPress={() => setActiveSheet("comment")}
          />
          <SettingsRow
            icon={AtSign}
            tint="violet"
            title={t("privacy_settings.mention_tag_me")}
            subtitle={audienceLabel(mentionAudience)}
            onPress={() => setActiveSheet("mention")}
          />
          <SettingsRow
            icon={MapPin}
            tint="red"
            title={t("privacy_settings.show_location")}
            rightElement={
              <Switch
                value={showLocationOnPosts}
                onValueChange={setShowLocationOnPosts}
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("privacy_settings.show_location")}
              />
            }
          />
          <SettingsRow
            icon={Search}
            tint="cyan"
            title={t("privacy_settings.discoverable_search")}
            rightElement={
              <Switch
                value={discoverableInSearch}
                onValueChange={setDiscoverableInSearch}
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("privacy_settings.discoverable_search")}
              />
            }
          />
        </VStack>

        <VStack space="xs" className="bg-card">
          <SettingsSectionHeader title={t("privacy_settings.collections_section")} />
          <SettingsRow
            icon={FolderLock}
            tint="slate"
            title={t("privacy_settings.keep_collections_private")}
            rightElement={
              <Switch
                value={keepCollectionsPrivate}
                onValueChange={setKeepCollectionsPrivate}
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("privacy_settings.keep_collections_private")}
              />
            }
          />
        </VStack>
      </VStack>

      <Actionsheet isOpen={activeSheet !== null} onClose={() => setActiveSheet(null)}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="px-6 py-6 pb-safe">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <VStack space="lg" className="mt-4 w-full">
            <Text className="text-lg font-bold text-foreground">
              {activeSheet === "comment"
                ? t("privacy_settings.comment_on_posts")
                : t("privacy_settings.mention_tag_me")}
            </Text>

            <RadioGroup value={activeAudienceValue} onChange={handleSelectAudience}>
              <VStack space="md" className="w-full">
                {AUDIENCE_OPTIONS.map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    size="md"
                    className="w-full flex-row-reverse justify-between py-2"
                  >
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel className="text-base font-normal text-foreground">
                      {audienceLabel(option)}
                    </RadioLabel>
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>

            <Button
              onPress={() => setActiveSheet(null)}
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
    </KeyboardAvoidingScrollView>
  );
};

export default PrivacyScreen;
