import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { useAppBottomInset } from "@/hooks/useAppInsets";
import { useSignInInitiateOtp, useVerifyPassword } from "@/hooks/useAuth";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { useJourneyStore } from "@/stores/journey.store";
import Logo from "@/components/custom/Logo";

const PasswordLogin = () => {
  const { t } = useTranslation();
  const bottomInset = useAppBottomInset();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const phone = useJourneyStore((s) => s.phone);
  const country = useJourneyStore((s) => s.country);
  const countryCode = country.dial;

  const { isPending, mutateAsync: verifyPassword } = useVerifyPassword();
  const { isPending: isPendingOtp, mutateAsync: signInInitiateOtp } =
    useSignInInitiateOtp();

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignIn = async () => {
    setError(null);
    const cleanedPassword = password.trim();

    if (!cleanedPassword) {
      setError(t("auth.password_error_required"));
      return;
    }

    if (cleanedPassword.length < 8) {
      setError(t("auth.password_helper"));
      return;
    }

    verifyPassword(
      {
        contact: `${countryCode.replace("+", "")}-${phone}`,
        password: cleanedPassword,
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
          setError(err?.response?.message || t("auth.invalid_phone_error"));
        },
      },
    );
  };

  function sendOtp() {
    signInInitiateOtp(
      {
        contact: `${countryCode.replace("+", "")}-${phone}`,
        profileType: "USER",
      },
      {
        onSuccess: (res) => {
          console.log("res", res);
        },
        onError: (err: any) => {
          console.log("err", err?.response?.message);
          setError(err?.response?.message || t("auth.invalid_phone_error"));
        },
      },
    );
  }

  return (
    <KeyboardAvoidingScrollView>
      <VStack className="flex-1 justify-between bg-background relative">
        {/* Brand/Logo Section */}
        <VStack
          className="flex-1 items-center justify-center px-6 py-12"
          space="md"
        >
          <Logo size={40} />
        </VStack>

        {/* Bottom Card Form */}
        <Card
          className="px-4 bg-card pt-8 shadow-none border-0 rounded-none rounded-t-4xl"
          style={{ paddingBottom: bottomInset + 20 }}
        >
          <VStack space="2xl">
            <VStack space="xs">
              <Heading size="2xl" className="font-bold text-foreground">
                {t("auth.password_login_title")}
              </Heading>
              <Text size="sm" className="text-muted-foreground">
                {t("auth.password_login_subtitle", {
                  phone: `${countryCode} ${phone}`,
                })}
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
                    {t("auth.password_label")}
                  </FormControlLabelText>
                </FormControlLabel>

                {/* Password Input with eye icon toggle */}
                <Input className="w-full flex-row items-center">
                  <InputField
                    secureTextEntry={!showPassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                    spellCheck={false}
                    textContentType="password"
                    keyboardType="ascii-capable"
                    placeholder={t("auth.password_placeholder")}
                    value={password}
                    clearTextOnFocus={false}
                    onChangeText={(val) => {
                      setPassword(val);
                      // if (error) setError(null);
                    }}
                    className="flex-1 text-base text-foreground"
                  />

                  <InputSlot onPress={handleToggle} className="pr-3">
                    <InputIcon
                      as={showPassword ? EyeOff : Eye}
                      className="w-5 h-5 text-muted-foreground"
                    />
                  </InputSlot>
                </Input>

                {/* <FormControlHelper>
                  <FormControlHelperText>
                    {t("auth.password_helper")}
                  </FormControlHelperText>
                </FormControlHelper> */}

                {error && (
                  <FormControlError>
                    <FormControlErrorText>{error}</FormControlErrorText>
                  </FormControlError>
                )}
              </VStack>
            </FormControl>

            {/* Sign In Button */}
            <Button
              size="xl"
              variant="theme"
              onPress={handleSignIn}
              disabled={isPending}
              className="gap-1"
            >
              <ButtonText>{t("auth.sign_in")}</ButtonText>
              {isPending ? (
                <ButtonSpinner color={"white"} />
              ) : (
                <Icon as={ChevronRightIcon} className="text-white stroke-2" />
              )}
            </Button>

            {/* Switch authentication method / forgot password actions */}
            <HStack space="xs" className="justify-between items-center">
              <Button
                variant="link"
                size="default"
                onPress={() => router.replace(ROUTES.AUTH.HOME)}
                className="p-0"
              >
                <ButtonIcon as={ArrowLeft} />
                <ButtonText className="">{t("auth.back_to_login")}</ButtonText>
              </Button>

              <Button
                variant="link"
                size="default"
                disabled={isPendingOtp}
                onPress={() => {
                  sendOtp();
                  router.push({
                    pathname: ROUTES.AUTH.VERIFY_OTP,
                    params: { mode: "sign-in" },
                  });
                }}
                className="p-0"
              >
                <ButtonText className="font-semibold text-primary">
                  {t("auth.login_with_otp")}
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default PasswordLogin;
