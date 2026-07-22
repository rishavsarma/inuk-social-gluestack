import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import Logo from "@/components/custom/Logo";
import { OnboardingStepHeader } from "@/components/custom/onboarding/OnboardingStepHeader";
import { SelectableRadioList } from "@/components/custom/SelectableRadioList";
import { useAppInsets } from "@/hooks/useAppInsets";
import { LANGUAGES } from "@/constants";
import { ROUTES } from "@/routes";
import { useSettingStore } from "@/stores/setting.store";

const OnboardingLanguage = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useAppInsets();

  const language = useSettingStore((s) => s.language);
  const setLanguage = useSettingStore((s) => s.setLanguage);

  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    router.push(ROUTES.ONBOARDING.THEME);
  };

  return (
    <VStack
      className="flex-1 bg-background px-6"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <OnboardingStepHeader step={1} totalSteps={2} />

      <VStack space="md" className="items-center mt-10 mb-10">
        <Logo size={40} />

        <VStack>
          <Heading
            size="2xl"
            className="font-bold text-foreground text-center font-baloo-bold"
          >
            {t("onboarding.language_title")}
          </Heading>
          <Text size="sm" className="text-muted-foreground text-center">
            {t("onboarding.language_subtitle")}
          </Text>
        </VStack>
      </VStack>

      <SelectableRadioList
        items={LANGUAGES.map((item) => ({
          id: item.id,
          label: t(item.labelKey),
        }))}
        value={selectedLanguage}
        onChange={setSelectedLanguage}
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

export default OnboardingLanguage;
