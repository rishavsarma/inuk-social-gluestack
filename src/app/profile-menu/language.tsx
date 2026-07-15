import React from "react";

import { useTranslation } from "react-i18next";
import { router } from "expo-router";

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
import { LANGUAGES } from "@/constants";
import { useSettingStore } from "@/stores/setting.store";

const LanguageScreen = () => {
  const { t, i18n } = useTranslation();
  const language = useSettingStore((state) => state.language);
  const setLanguage = useSettingStore((state) => state.setLanguage);

  const handleSelect = (id: string) => {
    if (id !== language) {
      setLanguage(id);
      i18n.changeLanguage(id);
    }
    router.back();
  };

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("settings.language")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="md" className="px-4 pt-4">
        <RadioGroup value={language} onChange={handleSelect}>
          <VStack space="md" className="w-full">
            {LANGUAGES.map((item) => {
              const isSelected = item.id === language;
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
                  <RadioLabel className="flex-1 text-lg font-semibold text-foreground font-baloo-semibold">
                    {t(item.labelKey)}
                  </RadioLabel>
                </Radio>
              );
            })}
          </VStack>
        </RadioGroup>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default LanguageScreen;
