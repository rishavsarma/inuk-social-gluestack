import { Monitor, Moon, Sun } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import switchTheme from "react-native-theme-switch-animation";

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { ChevronDownIcon, CircleIcon, Icon } from "@/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerIcon,
  TabsTriggerText,
} from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { THEMES } from "@/constants";
import { useSettingStore } from "@/stores/setting.store";

const ICON_MAP = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

interface ThemeSwitcherProps {
  variant?: "tab" | "select";
}

export function ThemeSwitcher({ variant = "tab" }: ThemeSwitcherProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useSettingStore();

  const [isOpen, setIsOpen] = useState(false);
  const [tempTheme, setTempTheme] = useState<AppTheme>(theme);

  const handleThemeChange = (selectedTheme: AppTheme) => {
    if (selectedTheme === theme) return;

    // Tab variant: top to bottom (cyRatio: 0.0)
    switchTheme({
      switchThemeFunction: () => {
        setTheme(selectedTheme);
      },
      animationConfig: {
        type: "circular",
        duration: 800,
        startingPoint: {
          cxRatio: 0.5,
          cyRatio: 0.0,
        },
      },
    });
  };

  const handleSave = () => {
    setIsOpen(false);

    // Wait for the Actionsheet slide-down animation to complete, then switch theme
    setTimeout(() => {
      if (tempTheme === theme) return;

      // Select variant: bottom to top (cyRatio: 1.0)
      switchTheme({
        switchThemeFunction: () => {
          setTheme(tempTheme);
        },
        animationConfig: {
          type: "circular",
          duration: 800,
          startingPoint: {
            cxRatio: 0.5,
            cyRatio: 1.0,
          },
        },
      });
    }, 250);
  };

  if (variant === "select") {
    const selectedThemeItem =
      THEMES.find((item) => item.id === theme) || THEMES[0];

    return (
      <VStack space="xs" className="w-full">
        <Text className="text-sm font-semibold text-muted-foreground px-1">
          {t("settings.theme")}
        </Text>

        <Pressable
          onPress={() => {
            setTempTheme(theme);
            setIsOpen(true);
          }}
          className="w-full"
        >
          <View className="flex-row justify-between items-center px-4 py-3 border border-border rounded-lg bg-background dark:bg-input/20">
            <View className="flex-row items-center gap-2">
              <Icon
                as={ICON_MAP[selectedThemeItem.id]}
                className="text-muted-foreground"
                size="lg"
              />
              <Text className="text-base text-foreground pl-2 font-normal">
                {t(selectedThemeItem.labelKey)}
              </Text>
            </View>
            <Icon as={ChevronDownIcon} className="text-muted-foreground" />
          </View>
        </Pressable>

        <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ActionsheetBackdrop />
          <ActionsheetContent className="px-6 py-6 pb-safe">
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>

            <VStack space="lg" className="w-full mt-4">
              <Text className="text-lg font-bold text-foreground">
                {t("settings.theme")}
              </Text>

              <RadioGroup
                value={tempTheme}
                onChange={(val: string) => setTempTheme(val as AppTheme)}
              >
                <VStack space="md" className="w-full">
                  {THEMES.map((item) => (
                    <Radio
                      key={item.id}
                      value={item.id}
                      size="md"
                      className="justify-between flex-row-reverse w-full py-2"
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
                onPress={handleSave}
                size="lg"
                variant="default"
                className="w-full rounded-full mt-2"
              >
                <ButtonText>{t("settings.save_preference")}</ButtonText>
              </Button>
            </VStack>
          </ActionsheetContent>
        </Actionsheet>
      </VStack>
    );
  }

  // Default "tab" variant
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
