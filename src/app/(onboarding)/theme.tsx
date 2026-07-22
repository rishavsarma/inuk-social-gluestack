import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { OnboardingStepHeader } from "@/components/custom/onboarding/OnboardingStepHeader";
import { SelectableRadioList } from "@/components/custom/SelectableRadioList";
import { useAppInsets } from "@/hooks/useAppInsets";
import { THEMES } from "@/constants";
import { ROUTES } from "@/routes";
import { useSettingStore } from "@/stores/setting.store";
import Logo from "@/components/custom/Logo";
import { ThemeSwatch } from "@/components/custom/ThemeSwatch";

const OnboardingTheme = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useAppInsets();

  const theme = useSettingStore((s) => s.theme);
  const setTheme = useSettingStore((s) => s.setTheme);

  const [selectedTheme, setSelectedTheme] = useState<AppTheme>(theme);

  const handleContinue = () => {
    setTheme(selectedTheme);
    router.push(ROUTES.ONBOARDING.DRIVER);
  };

  return (
    <VStack
      className="flex-1 bg-background px-6"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <OnboardingStepHeader
        step={2}
        totalSteps={2}
        onBack={() => router.back()}
      />
      <VStack space="md" className="items-center mt-10 mb-10">
        <Logo size={40} />

        <VStack>
          <Heading
            size="2xl"
            className="font-bold text-foreground text-center font-baloo-bold"
          >
            {t("onboarding.theme_title")}
          </Heading>
          <Text size="sm" className="text-muted-foreground text-center">
            {t("onboarding.theme_subtitle")}
          </Text>
        </VStack>
      </VStack>

      <SelectableRadioList
        items={THEMES.map((item) => ({
          id: item.id,
          label: t(item.labelKey),
        }))}
        value={selectedTheme}
        onChange={setSelectedTheme}
        renderLeading={(id) => <ThemeSwatch id={id} />}
      />

      <View className="flex-1" />

      <Button size="xl" variant="theme" onPress={handleContinue}>
        <ButtonText className="text-white">
          {t("onboarding.continue")}
        </ButtonText>
      </Button>
    </VStack>
  );
};

export default OnboardingTheme;
