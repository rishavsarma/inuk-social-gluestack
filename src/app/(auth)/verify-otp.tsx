import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OtpInput } from "react-native-otp-entry";

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
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { useAppBottomInset } from "@/hooks/use-app-insets";
import { ROUTES } from "@/routes";

import { useSignInVerifyOtp, useSignUpVerifyOtp } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth.store";
import { useJourneyStore } from "@/stores/journey.store";
import { useSettingStore } from "@/stores/setting.store";
import { useColorScheme } from "react-native";

const VerifyOtp = () => {
  const bottomInset = useAppBottomInset();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode: string;
  }>();
  const phone = useJourneyStore((s) => s.phone);
  const country = useJourneyStore((s) => s.country);
  const countryCode = country.dial;
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const mode = params.mode;
  const isSignIn = mode === "sign-in";
  const isSignUp = mode === "sign-up";
  const setAuth = useAuthStore((s) => s.setAuth);
  const { theme } = useSettingStore();
  const systemColorScheme = useColorScheme();
  const activeTheme = theme === "system" ? systemColorScheme : theme;
  const isDark = activeTheme === "dark";

  const { isPending: isSignInVerifyOtpPending, mutateAsync: signInVerifyOtp } =
    useSignInVerifyOtp();

  const { isPending: isSignUpVerifyOtpPending, mutateAsync: signUpVerifyOtp } =
    useSignUpVerifyOtp();

  // Countdown timer for resend OTP code
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    setError(null);
    const cleanedCode = code.trim();

    if (!cleanedCode) {
      setError(t("auth.otp_error_required"));
      return;
    }

    if (cleanedCode.length !== 6 || !/^\d+$/.test(cleanedCode)) {
      setError(t("auth.otp_error_invalid"));
      return;
    }

    if (isSignIn) {
      signInVerifyOtp(
        {
          // requestId: "aaa",
          contact: `${countryCode.replace("+", "")}-${phone}`,
          otp: cleanedCode,
          profileType: "USER",
        },
        {
          onSuccess: (res) => {
            const user = {
              accountId: res.account.id,
              accountType: res.account.type,
              accountStatus: res.account.status,
              tenantId: res.account.tenantId,
              profileId: res.profile.id,
              profileStatus: res.profile.status,
              avatar: res.profile.avatar,
              coverPhoto: res.profile.coverPhoto,
              name: res.profile.name,
              mobile: res.account.mobile,
              email: res.account.email,
              expiry: res.expiry,
            };
            const token = res.token;
            setAuth(user, token);
            router.replace(ROUTES.TABS.FEED);
          },
          onError: (err: any) => {
            console.log("err", err?.response);
            setError(err?.response?.message || t("auth.invalid_phone_error"));
          },
        },
      );
    }
    if (isSignUp) {
      signUpVerifyOtp(
        {
          requestId: "aaa",
          contact: `${countryCode.replace("+", "")}-${phone}`,
          otp: cleanedCode,
          profileType: "USER",
        },
        {
          onSuccess: (res) => {
            router.push({
              pathname: ROUTES.AUTH.SET_PASSWORD,
              params: { mode: "set-password" },
            });
          },
          onError: (err: any) => {
            console.log("err", err?.response?.message);
            setError(err?.response?.message || t("auth.invalid_phone_error"));
          },
        },
      );
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError(null);
    // setIsLoading(true);
    // try {
    //   const response = await authService.sendOtp(countryCode, phone);
    //   if (response.success) {
    //     setTimer(30);
    //   } else {
    //     setError(response.message);
    //   }
    // } catch (err: any) {
    //   setError(err.message || t("auth.otp_error_invalid"));
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <KeyboardAvoidingScrollView keyboardMode="layout">
      <VStack className="flex-1 justify-between bg-background ">
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
                {t("auth.verify_otp_title")}
              </Heading>
              <HStack space="xs" className="items-center">
                <Text size="sm" className="text-muted-foreground">
                  {t("auth.verify_otp_subtitle", {
                    phone: `${countryCode} ${phone}`,
                  })}
                </Text>
                {timer > 0 ? (
                  <Text size="md" className="text-muted-foreground">
                    {t("auth.resend_code_in", { seconds: timer })}
                  </Text>
                ) : (
                  <Button
                    variant="link"
                    size="default"
                    onPress={handleResend}
                    className="p-0  py-0 min-h-fit"
                  >
                    <ButtonText className="">
                      {t("auth.resend_code")}
                    </ButtonText>
                  </Button>
                )}
              </HStack>
            </VStack>

            <FormControl
              isInvalid={!!error}
              isDisabled={isSignInVerifyOtpPending || isSignUpVerifyOtpPending}
              className="w-full"
            >
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.otp_label")}
                  </FormControlLabelText>
                </FormControlLabel>

                {/* 6-digit styled OTP Input */}
                <OtpInput
                  numberOfDigits={6}
                  focusColor={isDark ? "rgb(255, 245, 245)" : "rgb(23, 23, 23)"}
                  onTextChange={(val) => {
                    setCode(val);
                    if (error) setError(null);
                  }}
                  theme={{
                    pinCodeContainerStyle: {
                      borderColor: isDark
                        ? "rgb(46, 46, 46)"
                        : "rgb(229, 229, 229)",
                      backgroundColor: isDark
                        ? "rgb(23, 23, 23)"
                        : "rgb(255, 255, 255)",
                      borderRadius: 8,
                      borderWidth: 1,
                      width: 45,
                      height: 50,
                    },
                    focusedPinCodeContainerStyle: {
                      borderColor: isDark
                        ? "rgb(255, 245, 245)"
                        : "rgb(23, 23, 23)",
                    },
                    pinCodeTextStyle: {
                      color: isDark ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)",
                      fontSize: 18,
                      fontWeight: "600",
                    },
                    focusStickStyle: {
                      backgroundColor: isDark
                        ? "rgb(255, 245, 245)"
                        : "rgb(23, 23, 23)",
                    },
                  }}
                  type="numeric"
                  disabled={
                    isSignInVerifyOtpPending || isSignUpVerifyOtpPending
                  }
                />

                {/* <FormControlHelper>
                  <FormControlHelperText>
                    {t("auth.otp_helper")}
                  </FormControlHelperText>
                </FormControlHelper> */}

                {error && (
                  <FormControlError>
                    <FormControlErrorText>{error}</FormControlErrorText>
                  </FormControlError>
                )}
              </VStack>
            </FormControl>

            {/* Verify Button */}
            <Button
              size="xl"
              variant="theme"
              onPress={handleVerify}
              disabled={isSignInVerifyOtpPending || isSignUpVerifyOtpPending}
              className="gap-1"
            >
              <ButtonText className="font-serif">{t("auth.verify")}</ButtonText>
              {isSignInVerifyOtpPending || isSignUpVerifyOtpPending ? (
                <ButtonSpinner color={"white"} />
              ) : (
                <Icon as={ChevronRightIcon} className="text-white stroke-2" />
              )}
            </Button>

            {/* Timer and Resend Actions */}
            <HStack space="xs" className="justify-between items-center">
              <Button
                variant="link"
                size="default"
                onPress={() => router.replace(ROUTES.AUTH.HOME)}
                className="p-0"
                disabled={isSignInVerifyOtpPending || isSignUpVerifyOtpPending}
              >
                <ButtonIcon as={ArrowLeft} />
                <ButtonText className="">{t("auth.back_to_login")}</ButtonText>
              </Button>
              {isSignIn && (
                <Button
                  variant="link"
                  size="default"
                  disabled={
                    isSignInVerifyOtpPending || isSignUpVerifyOtpPending
                  }
                  onPress={() =>
                    router.push({
                      pathname: ROUTES.AUTH.PASSWORD_LOGIN,
                      params: { phone, countryCode },
                    })
                  }
                  className="p-0"
                >
                  <ButtonText className="font-semibold text-primary">
                    {t("auth.login_with_password")}
                  </ButtonText>
                </Button>
              )}
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default VerifyOtp;
