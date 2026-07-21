import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CircleIcon } from "@/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import Logo from "@/components/custom/Logo";
import { OnboardingStepHeader } from "@/components/custom/onboarding/OnboardingStepHeader";
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

      <RadioGroup value={selectedLanguage} onChange={setSelectedLanguage}>
        <VStack space="md" className="w-full">
          {LANGUAGES.map((item) => {
            const isSelected = item.id === selectedLanguage;
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
                <RadioLabel className="flex-1 text-lg font-semibold text-foreground font-baloo-semibold ">
                  {t(item.labelKey)}
                </RadioLabel>
              </Radio>
            );
          })}
        </VStack>
      </RadioGroup>

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
