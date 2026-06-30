import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react-native";
import { useSettingStore } from "@/stores/setting.store";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { ChevronDownIcon, Icon } from "@/components/ui/icon";
import { LANGUAGES } from "@/constants";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";

export function LangSwitcher() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useSettingStore();

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
  };

  const selectedLang = LANGUAGES.find((l) => l.id === language);

  return (
    <VStack space="xs" className="w-full">
      <Text className="text-sm font-semibold text-muted-foreground px-1">
        {t("settings.language")}
      </Text>

      <Select selectedValue={language} onValueChange={handleLanguageChange}>
        <SelectTrigger
          variant="outline"
          size="lg"
          className="justify-between pl-4"
        >
          <Icon as={Globe} className="text-muted-foreground" size="lg" />
          <SelectInput
            value={selectedLang ? t(selectedLang.labelKey) : ""}
            className="flex-1 pl-2"
          />
          <SelectIcon as={ChevronDownIcon} className="mr-3" />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {LANGUAGES.map((item) => (
              <SelectItem
                key={item.id}
                label={t(item.labelKey)}
                value={item.id}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </VStack>
  );
}
