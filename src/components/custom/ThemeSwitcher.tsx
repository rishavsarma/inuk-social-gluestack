import React from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Monitor } from "lucide-react-native";
import { useSettingStore } from "@/stores/setting.store";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { THEMES } from "@/constants";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
  TabsIndicator,
  TabsTriggerIcon,
} from "@/components/ui/tabs";

const ICON_MAP = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const { theme, setTheme } = useSettingStore();

  const handleThemeChange = (selectedTheme: AppTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <VStack space="xs" className="w-full">
      <Text className="text-sm font-semibold text-muted-foreground px-1">
        {t("settings.theme")}
      </Text>

      <Tabs
        variant={"filled"}
        value={theme}
        onValueChange={(val: string) => handleThemeChange(val as AppTheme)}
      >
        <TabsList>
          {THEMES.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              <TabsTriggerIcon as={ICON_MAP[item.id]} />
              <TabsTriggerText>{t(item.labelKey)}</TabsTriggerText>
            </TabsTrigger>
          ))}
          <TabsIndicator />
        </TabsList>
      </Tabs>
    </VStack>
  );
}
