import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, ButtonText } from "@/components/ui/button";
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
import { useSignInInitiateOtp, useVerifyPassword } from "@/hooks/useAuth";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { useJourneyStore } from "@/stores/journey.store";
import AuthScreenLayout from "@/components/custom/AuthScreenLayout";
import AuthSubmitButton from "@/components/custom/AuthSubmitButton";
import BackToLoginButton from "@/components/custom/BackToLoginButton";

const PasswordLogin = () => {
  const { t } = useTranslation();
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
        onError: (err: any) => {
          setError(err?.response?.message || t("auth.invalid_phone_error"));
        },
      },
    );
  }

  return (
    <KeyboardAvoidingScrollView>
      <AuthScreenLayout>
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
                  accessibilityLabel={t("auth.password_label")}
                  value={password}
                  clearTextOnFocus={false}
                  onChangeText={(val) => {
                    setPassword(val);
                    // if (error) setError(null);
                  }}
                  className="flex-1 text-base text-foreground"
                />

                <InputSlot
                  onPress={handleToggle}
                  className="pr-3"
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword
                      ? t("auth.hide_password")
                      : t("auth.show_password")
                  }
                  accessibilityState={{ selected: showPassword }}
                >
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
          <AuthSubmitButton
            label={t("auth.sign_in")}
            onPress={handleSignIn}
            isLoading={isPending}
            disabled={isPending}
          />

          {/* Switch authentication method / forgot password actions */}
          <HStack space="xs" className="justify-between items-center">
            <BackToLoginButton />

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
              accessibilityRole="button"
              accessibilityLabel={t("auth.login_with_otp")}
              accessibilityState={{ disabled: isPendingOtp }}
            >
              <ButtonText className="font-semibold text-primary">
                {t("auth.login_with_otp")}
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </AuthScreenLayout>
    </KeyboardAvoidingScrollView>
  );
};

export default PasswordLogin;
