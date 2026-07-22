import React from "react";

import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import switchTheme from "react-native-theme-switch-animation";

import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { SelectableRadioList } from "@/components/custom/SelectableRadioList";
import { ThemeSwatch } from "@/components/custom/ThemeSwatch";
import { THEMES } from "@/constants";
import { useSettingStore } from "@/stores/setting.store";

const ThemeScreen = () => {
  const { t } = useTranslation();
  const theme = useSettingStore((state) => state.theme);
  const setTheme = useSettingStore((state) => state.setTheme);

  const handleSelect = (selected: string) => {
    if (selected === theme) {
      router.back();
      return;
    }
    switchTheme({
      switchThemeFunction: () => {
        setTheme(selected as AppTheme);
      },
    });
    router.back();
  };

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("settings.theme")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="md" className="px-4 pt-4">
        <SelectableRadioList
          items={THEMES.map((item) => ({
            id: item.id,
            label: t(item.labelKey),
          }))}
          value={theme}
          onChange={handleSelect}
          renderLeading={(id) => <ThemeSwatch id={id} />}
        />
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default ThemeScreen;
