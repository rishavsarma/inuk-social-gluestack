import React from "react";

import { useTranslation } from "react-i18next";
import { router } from "expo-router";

import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { SelectableRadioList } from "@/components/custom/SelectableRadioList";
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
        <SelectableRadioList
          items={LANGUAGES.map((item) => ({
            id: item.id,
            label: t(item.labelKey),
          }))}
          value={language}
          onChange={handleSelect}
        />
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default LanguageScreen;
