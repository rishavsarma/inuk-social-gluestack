import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Check, Eye, EyeOff, X } from "lucide-react-native";
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
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { useAppBottomInset } from "@/hooks/use-app-insets";
import { ROUTES } from "@/routes";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useResetPasswordUpdate, useSignUpSetPassword } from "@/hooks/use-auth";

const SetPassword = () => {
  const bottomInset = useAppBottomInset();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode: string;
  }>();

  const mode = params.mode;
  const isSetPassword = mode === "set-password";
  const isResetPassword = mode === "reset-password";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const {
    isPending: isSignUpSetPasswordPending,
    mutateAsync: signUpSetPassword,
  } = useSignUpSetPassword();

  const {
    isPending: isResetPasswordUpdatePending,
    mutateAsync: resetPasswordUpdate,
  } = useResetPasswordUpdate();

  const rules = [
    {
      key: "length",
      label: t("auth.password_rule_length"),
      met: password.length >= 8,
    },
    {
      key: "uppercase",
      label: t("auth.password_rule_uppercase"),
      met: /[A-Z]/.test(password),
    },
    {
      key: "lowercase",
      label: t("auth.password_rule_lowercase"),
      met: /[a-z]/.test(password),
    },
    {
      key: "number",
      label: t("auth.password_rule_number"),
      met: /[0-9]/.test(password),
    },
    {
      key: "special",
      label: t("auth.password_rule_special"),
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const strengthScore = rules.filter((r) => r.met).length;
  const progressValue = (strengthScore / 5) * 100;

  let trackColor = "#ef4444"; // red-500
  let strengthLabel = "";
  if (password.length > 0) {
    if (strengthScore >= 5) {
      trackColor = "#22c55e"; // green-500
      strengthLabel = t("auth.password_strength_strong");
    } else if (strengthScore >= 3) {
      trackColor = "#eab308"; // yellow-500
      strengthLabel = t("auth.password_strength_medium");
    } else {
      trackColor = "#ef4444"; // red-500
      strengthLabel = t("auth.password_strength_weak");
    }
  }

  const handleSetPassword = async () => {
    setPasswordError(null);
    setConfirmPasswordError(null);

    const cleanedPassword = password.trim();
    const cleanedConfirmPassword = confirmPassword.trim();
    let hasError = false;

    if (!cleanedPassword) {
      setPasswordError(t("auth.password_error_required"));
      hasError = true;
    } else {
      const hasUppercase = /[A-Z]/.test(cleanedPassword);
      const hasLowercase = /[a-z]/.test(cleanedPassword);
      const hasDigit = /[0-9]/.test(cleanedPassword);
      const hasSpecial = /[^A-Za-z0-9]/.test(cleanedPassword);
      const isLengthValid = cleanedPassword.length >= 8;

      if (
        !hasUppercase ||
        !hasLowercase ||
        !hasDigit ||
        !hasSpecial ||
        !isLengthValid
      ) {
        setPasswordError(t("auth.password_strength_error"));
        hasError = true;
      }
    }

    if (!cleanedConfirmPassword) {
      setConfirmPasswordError(t("auth.password_error_required"));
      hasError = true;
    } else if (cleanedPassword !== cleanedConfirmPassword) {
      setConfirmPasswordError(t("auth.password_mismatch_error"));
      hasError = true;
    }

    if (hasError) return;

    if (isSetPassword) {
      signUpSetPassword(
        {
          password: cleanedPassword,
          confirmPassword: cleanedConfirmPassword,
        },
        {
          onSuccess: (res) => {
            router.replace(ROUTES.AUTH.SET_PROFILE);
          },
          onError: (err: any) => {
            setPasswordError(
              err?.response?.message || t("auth.invalid_phone_error"),
            );
          },
        },
      );
    }

    if (isResetPassword) {
      resetPasswordUpdate(
        {
          password: cleanedPassword,
          confirmPassword: cleanedConfirmPassword,
          requestId: "",
        },
        {
          onSuccess: (res) => {
            router.replace(ROUTES.AUTH.HOME);
          },
          onError: (err: any) => {
            setPasswordError(
              err?.response?.message || t("auth.invalid_phone_error"),
            );
          },
        },
      );
    }
  };

  return (
    <KeyboardAvoidingScrollView>
      <VStack className="flex-1 justify-between bg-background relative">
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
          <VStack space="lg">
            <VStack>
              <Heading size="xl" className="font-bold text-foreground">
                {t("auth.set_password_title")}
              </Heading>
              <Text size="sm" className="text-muted-foreground">
                {t("auth.set_password_subtitle")}
              </Text>
            </VStack>

            {/* Password input */}
            <FormControl
              isInvalid={!!passwordError}
              isDisabled={
                isResetPasswordUpdatePending || isSignUpSetPasswordPending
              }
              className="w-full"
            >
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.new_password_label")}
                  </FormControlLabelText>
                </FormControlLabel>

                <Input className="w-full flex-row items-center">
                  <InputField
                    secureTextEntry={!showPassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                    spellCheck={false}
                    textContentType="newPassword"
                    keyboardType="ascii-capable"
                    placeholder={t("auth.new_password_placeholder")}
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (passwordError) setPasswordError(null);
                    }}
                    className="flex-1 text-base text-foreground"
                  />
                  <InputSlot
                    onPress={() => setShowPassword((prev) => !prev)}
                    className="pr-3"
                  >
                    <InputIcon
                      as={showPassword ? EyeOff : Eye}
                      className="w-5 h-5 text-muted-foreground"
                    />
                  </InputSlot>
                </Input>

                {/* Password Strength Bar */}
                {password.length > 0 && (
                  <VStack space="xs" className="mt-2">
                    <HStack className="justify-between items-center">
                      <Text size="xs" className="text-muted-foreground">
                        Password Strength:
                      </Text>
                      <Text
                        size="xs"
                        className={cn(
                          strengthScore >= 5
                            ? "text-green-500 font-bold"
                            : strengthScore >= 3
                              ? "text-yellow-500 font-bold"
                              : "text-red-500 font-bold",
                        )}
                      >
                        {strengthLabel}
                      </Text>
                    </HStack>
                    <Progress
                      value={progressValue}
                      className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden"
                    >
                      <ProgressFilledTrack
                        style={{ backgroundColor: trackColor }}
                      />
                    </Progress>
                  </VStack>
                )}

                {/* Password Rules Checklist */}
                <VStack space="xs" className="mt-3">
                  {rules.map((rule) => {
                    const hasInput = password.length > 0;
                    let colorClass = "text-muted-foreground";
                    let icon = Check;
                    if (hasInput) {
                      if (rule.met) {
                        colorClass = "text-green-500 font-medium";
                        icon = Check;
                      } else {
                        colorClass = "text-red-500";
                        icon = X;
                      }
                    }
                    return (
                      <HStack
                        key={rule.key}
                        space="xs"
                        className="items-center"
                      >
                        <Icon
                          as={icon}
                          className={cn(
                            "w-4 h-4",
                            hasInput
                              ? rule.met
                                ? "text-green-500"
                                : "text-red-500"
                              : "text-muted-foreground/40",
                          )}
                        />
                        <Text size="xs" className={colorClass}>
                          {rule.label}
                        </Text>
                      </HStack>
                    );
                  })}
                </VStack>

                {passwordError && (
                  <FormControlError className="mt-2">
                    <FormControlErrorText>{passwordError}</FormControlErrorText>
                  </FormControlError>
                )}
              </VStack>
            </FormControl>

            {/* Confirm Password input */}
            <FormControl
              isInvalid={!!confirmPasswordError}
              isDisabled={
                isResetPasswordUpdatePending || isSignUpSetPasswordPending
              }
              className="w-full"
            >
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.confirm_password_label")}
                  </FormControlLabelText>
                </FormControlLabel>

                <Input className="w-full flex-row items-center">
                  <InputField
                    secureTextEntry={!showConfirmPassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                    spellCheck={false}
                    textContentType="newPassword"
                    keyboardType="ascii-capable"
                    placeholder={t("auth.confirm_password_placeholder")}
                    value={confirmPassword}
                    onChangeText={(val) => {
                      setConfirmPassword(val);
                      if (confirmPasswordError) setConfirmPasswordError(null);
                    }}
                    className="flex-1 text-base text-foreground"
                  />
                  <InputSlot
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                    className="pr-3"
                  >
                    <InputIcon
                      as={showConfirmPassword ? EyeOff : Eye}
                      className="w-5 h-5 text-muted-foreground"
                    />
                  </InputSlot>
                </Input>

                {confirmPasswordError && (
                  <FormControlError>
                    <FormControlErrorText>
                      {confirmPasswordError}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </VStack>
            </FormControl>

            {/* Submit Button */}
            <Button
              variant="theme"
              size="xl"
              onPress={handleSetPassword}
              disabled={
                isResetPasswordUpdatePending || isSignUpSetPasswordPending
              }
              className="gap-1"
            >
              <ButtonText>{t("auth.set_password_button")}</ButtonText>
              {isResetPasswordUpdatePending || isSignUpSetPasswordPending ? (
                <ButtonSpinner color={"white"} />
              ) : (
                <Icon as={ChevronRightIcon} className="text-white stroke-2" />
              )}
            </Button>
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
              {/* <Button
                variant="link"
                size="default"
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
              </Button> */}
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default SetPassword;
