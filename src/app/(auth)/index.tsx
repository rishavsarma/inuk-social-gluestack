import { useRouter } from "expo-router";
import { ChevronRightIcon, Moon, Sun } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import switchTheme from "react-native-theme-switch-animation";

import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { COUNTRY_CODES } from "@/constants";
import { useAppBottomInset } from "@/hooks/useAppInsets";
import { useInitiateJourney } from "@/hooks/useAuth";
import { ROUTES } from "@/routes";
import { useJourneyStore } from "@/stores/journey.store";
import { useSettingStore } from "@/stores/setting.store";
import { Platform } from "react-native";

const AuthHome = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useSettingStore();
  const bottomInset = useAppBottomInset();
  const router = useRouter();

  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setPhone = useJourneyStore((s) => s.setPhone);
  const setCountry = useJourneyStore((s) => s.setCountry);
  const setOtpId = useJourneyStore((s) => s.setOtpId);

  const { isPending, mutateAsync: initiateJourney } = useInitiateJourney();

  const isDark = theme === "dark";

  const toggleIOSTheme = () => {
    switchTheme({
      switchThemeFunction: () => {
        setTheme(isDark ? "light" : "dark");
      },
      animationConfig: {
        type: "circular",
        duration: 800,
        startingPoint: {
          cxRatio: 0.9,
          cyRatio: 0.05,
        },
      },
    });
  };
  const toggleAndroidTheme = () => {
    switchTheme({
      switchThemeFunction: () => {
        setTheme(isDark ? "light" : "dark");
      },
      animationConfig: {
        type: "fade",
        duration: 800,
      },
    });
  };

  function toggleTheme() {
    if (Platform.OS === "ios") {
      toggleIOSTheme();
    } else {
      toggleAndroidTheme();
    }
  }

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const handleContinue = () => {
    setError(null);
    const cleanedPhone = phoneNumber.trim();

    if (!cleanedPhone) {
      setError(t("auth.invalid_phone_error"));
      return;
    }

    if (cleanedPhone.length !== 10 || !/^\d+$/.test(cleanedPhone)) {
      setError(t("auth.invalid_phone_error"));
      return;
    }

    if (!countryCode) {
      setError("Please select country code");
      return;
    }

    initiateJourney(
      {
        contact: `${countryCode.replace("+", "")}-${cleanedPhone}`,
        accountType: "USER",
      },
      {
        onSuccess: async (res) => {
          // Set phone and country in global store for subsequent screens
          setPhone(cleanedPhone);
          setCountry({ dial: countryCode });

          // const otpId = Array.isArray(res.data) ? res.data[0] : undefined;
          // if (otpId) setOtpId(otpId);

          // else if (res.status === "BLOCKED") {
          //   const contact = `${countryCode.replace("+", "")}-${cleanedPhone}`;
          //   try {
          //     await authService.signInOtpInitiate({ contact });
          //     router.push(`${ROUTES.AUTH.VERIFY_OTP}?mode=signin`);
          //   } catch (err: any) {
          //     console.log("signInOtpInitiate err", err);
          //     setError(
          //       err?.response?.data?.message ??
          //         err?.message ??
          //         t("auth.invalid_phone_error"),
          //     );
          //   }
          // } else

          if (res.status === "VERIFICATION_PENDING") {
            router.push({
              pathname: ROUTES.AUTH.VERIFY_OTP,
              params: { mode: "sign-up" },
            });
          } else if (res.status === "ACTIVE") {
            router.push(ROUTES.AUTH.PASSWORD_LOGIN);
          } else {
            router.push(ROUTES.AUTH.HOME);
          }
        },
        onError: (err: any) => {
          console.log("err message", err?.response?.data?.message);
          const msg =
            err?.response?.data?.message ??
            err?.message ??
            t("auth.invalid_phone_error");
          setError(msg);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingScrollView>
      <VStack className="flex-1 justify-between bg-background relative">
        {/* Theme Switcher Button */}
        <Button
          onPress={toggleTheme}
          size="icon"
          variant="secondary"
          className="absolute right-4 h-12 w-12 top-2 rounded-full"
        >
          <ButtonIcon as={isDark ? Sun : Moon} size="lg" />
        </Button>

        {/* Brand/Logo Section */}
        <VStack
          className="flex-1 items-center justify-center px-6 py-12"
          space="md"
        >
          <Heading
            size="3xl"
            className="font-extrabold tracking-wider text-foreground"
          >
            INUK
          </Heading>
          <Text className="text-sm text-muted-foreground text-center">
            {t("auth.welcome")}
          </Text>
        </VStack>

        {/* Bottom Card Form */}
        <Card
          className="px-4 bg-card pt-8 shadow-none border-0 rounded-none"
          style={{ paddingBottom: bottomInset + 20 }}
        >
          <VStack space="2xl">
            <VStack space="xs">
              <Heading size="2xl" className="font-bold text-foreground">
                {t("auth.get_started")}
              </Heading>
              <Text size="sm" className="text-muted-foreground">
                {t("auth.enter_number_to_started")}
              </Text>
            </VStack>

            <FormControl
              isInvalid={!!error}
              isDisabled={isPending}
              className="w-full"
            >
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.phone_label")}
                  </FormControlLabelText>
                </FormControlLabel>

                <HStack space="sm" className="items-center">
                  {/* Country Selector */}
                  <Select
                    selectedValue={countryCode}
                    onValueChange={setCountryCode}
                  >
                    <SelectTrigger
                      variant="outline"
                      size="xl"
                      className="w-28 pl-1"
                    >
                      <SelectInput
                        value={`${selectedCountry.code}`}
                        className="flex-1 text-base font-medium text-foreground pointer-events-none px-0 mx-2"
                      />
                      <SelectIcon
                        as={ChevronDownIcon}
                        className="mr-2 text-foreground/50 w-4 h-4"
                      />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent className="bg-card gap-1">
                        <SelectDragIndicatorWrapper className="pt-4 pb-8">
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {COUNTRY_CODES.map((item) => (
                          <SelectItem
                            key={item.code}
                            label={`${item.flag}  ${item.code} (${item.country})`}
                            value={item.code}
                            className="py-4"
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>

                  {/* Phone Number Input */}
                  <Input className="flex-1">
                    <InputField
                      keyboardType="phone-pad"
                      placeholder={t("auth.phone_placeholder_10_digit")}
                      value={phoneNumber}
                      onChangeText={(val) => {
                        setPhoneNumber(val);
                        if (error) setError(null);
                      }}
                      className="text-base text-foreground"
                    />
                  </Input>
                </HStack>

                {/* <FormControlHelper>
                  <FormControlHelperText>
                    {t("auth.phone_helper")}
                  </FormControlHelperText>
                </FormControlHelper> */}

                {error && (
                  <FormControlError>
                    <FormControlErrorText>{error}</FormControlErrorText>
                  </FormControlError>
                )}
              </VStack>
            </FormControl>

            {/* Continue Button */}
            <Button
              size="xl"
              variant="theme"
              onPress={handleContinue}
              disabled={isPending}
              className="gap-1"
            >
              <ButtonText className="text-white">
                {t("auth.continue")}
              </ButtonText>
              {isPending ? (
                <ButtonSpinner color={"white"} />
              ) : (
                <Icon as={ChevronRightIcon} className="text-white stroke-2" />
              )}
            </Button>

            {/* Legal Footer Links */}
            <HStack
              space="xs"
              className="justify-center items-center flex-wrap"
            >
              <Text size="sm">{t("auth.terms_agreement")}</Text>
              <Button
                variant="ghost"
                size="default"
                className="p-0"
                onPress={() => router.push(ROUTES.LEGAL.TERMS)}
              >
                {/* <ButtonIcon as={ExternalLink} className="w-2 h-2" /> */}
                <ButtonText className="font-semibold text-sm border-b border-foreground/60">
                  {t("auth.terms")}
                </ButtonText>
              </Button>
              <Text size="sm">{t("auth.and")}</Text>
              <Button
                variant="ghost"
                size="default"
                className="p-0"
                onPress={() => router.push(ROUTES.LEGAL.PRIVACY)}
              >
                {/* <ButtonIcon as={ExternalLink} className="w-2 h-2" /> */}
                <ButtonText className="font-semibold text-sm border-b border-foreground/60">
                  {t("auth.privacy_policy")}
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default AuthHome;
