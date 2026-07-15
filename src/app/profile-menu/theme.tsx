import React from "react";

import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import switchTheme from "react-native-theme-switch-animation";

import { HStack } from "@/components/ui/hstack";
import { CircleIcon } from "@/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
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
        <RadioGroup value={theme} onChange={handleSelect}>
          <VStack space="md" className="w-full">
            {THEMES.map((item) => {
              const isSelected = item.id === theme;
              return (
                <Radio
                  key={item.id}
                  value={item.id}
                  size="md"
                  className={
                    "w-full flex-row-reverse items-center justify-between rounded-lg border px-4 py-4 active:opacity-70 " +
                    (isSelected
                      ? "border-theme bg-theme/10"
                      : "border-border bg-card")
                  }
                >
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <HStack space="md" className="flex-1 items-center">
                    <ThemeSwatch id={item.id} />
                    <RadioLabel className="flex-1 text-lg font-semibold text-foreground font-baloo-semibold">
                      {t(item.labelKey)}
                    </RadioLabel>
                  </HStack>
                </Radio>
              );
            })}
          </VStack>
        </RadioGroup>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default ThemeScreen;
