import React from "react";

import { AtSign, Award, Heart, Mail, Moon, ShieldAlert, Trophy } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Switch } from "@/components/ui/switch";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import {
  SettingsRow,
  SettingsSectionHeader,
} from "@/components/custom/settings/SettingsRow";
import { THEME_ACCENT_COLOR } from "@/constants";
import { useAccountSettingsStore } from "@/stores/accountSettings.store";

const NotificationPreferencesScreen = () => {
  const { t } = useTranslation();
  const switchColors = { true: THEME_ACCENT_COLOR };

  const likesCommentsEnabled = useAccountSettingsStore(
    (s) => s.likesCommentsEnabled,
  );
  const mentionsFollowsEnabled = useAccountSettingsStore(
    (s) => s.mentionsFollowsEnabled,
  );
  const contestsQuizzesEnabled = useAccountSettingsStore(
    (s) => s.contestsQuizzesEnabled,
  );
  const sparksBadgesEnabled = useAccountSettingsStore(
    (s) => s.sparksBadgesEnabled,
  );
  const moderationOutcomesEnabled = useAccountSettingsStore(
    (s) => s.moderationOutcomesEnabled,
  );
  const weeklyDigestEnabled = useAccountSettingsStore(
    (s) => s.weeklyDigestEnabled,
  );
  const quietHoursEnabled = useAccountSettingsStore((s) => s.quietHoursEnabled);
  const setNotificationPref = useAccountSettingsStore(
    (s) => s.setNotificationPref,
  );

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("settings.notifications")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="sm" className="bg-background">
        <VStack space="xs" className="bg-card">
          <SettingsSectionHeader title={t("notification_prefs.push_section")} />
          <SettingsRow
            icon={Heart}
            tint="red"
            title={t("notification_prefs.likes_comments")}
            rightElement={
              <Switch
                value={likesCommentsEnabled}
                onValueChange={(value) =>
                  setNotificationPref("likesCommentsEnabled", value)
                }
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("notification_prefs.likes_comments")}
              />
            }
          />
          <SettingsRow
            icon={AtSign}
            tint="blue"
            title={t("notification_prefs.mentions_follows")}
            rightElement={
              <Switch
                value={mentionsFollowsEnabled}
                onValueChange={(value) =>
                  setNotificationPref("mentionsFollowsEnabled", value)
                }
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("notification_prefs.mentions_follows")}
              />
            }
          />
          <SettingsRow
            icon={Trophy}
            tint="amber"
            title={t("notification_prefs.contests_quizzes")}
            rightElement={
              <Switch
                value={contestsQuizzesEnabled}
                onValueChange={(value) =>
                  setNotificationPref("contestsQuizzesEnabled", value)
                }
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("notification_prefs.contests_quizzes")}
              />
            }
          />
          <SettingsRow
            icon={Award}
            tint="violet"
            title={t("notification_prefs.sparks_badges")}
            rightElement={
              <Switch
                value={sparksBadgesEnabled}
                onValueChange={(value) =>
                  setNotificationPref("sparksBadgesEnabled", value)
                }
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("notification_prefs.sparks_badges")}
              />
            }
          />
          <SettingsRow
            icon={ShieldAlert}
            tint="slate"
            title={t("notification_prefs.moderation_outcomes")}
            rightElement={
              <Switch
                value={moderationOutcomesEnabled}
                onValueChange={(value) =>
                  setNotificationPref("moderationOutcomesEnabled", value)
                }
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("notification_prefs.moderation_outcomes")}
              />
            }
          />
        </VStack>

        <VStack space="xs" className="bg-card">
          <SettingsSectionHeader title={t("notification_prefs.email_section")} />
          <SettingsRow
            icon={Mail}
            tint="cyan"
            title={t("notification_prefs.weekly_digest")}
            rightElement={
              <Switch
                value={weeklyDigestEnabled}
                onValueChange={(value) =>
                  setNotificationPref("weeklyDigestEnabled", value)
                }
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("notification_prefs.weekly_digest")}
              />
            }
          />
          <SettingsRow
            icon={Moon}
            tint="indigo"
            title={t("notification_prefs.quiet_hours")}
            subtitle={t("notification_prefs.quiet_hours_range")}
            rightElement={
              <Switch
                value={quietHoursEnabled}
                onValueChange={(value) =>
                  setNotificationPref("quietHoursEnabled", value)
                }
                trackColor={switchColors}
                accessibilityRole="switch"
                accessibilityLabel={t("notification_prefs.quiet_hours")}
              />
            }
          />
        </VStack>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default NotificationPreferencesScreen;
