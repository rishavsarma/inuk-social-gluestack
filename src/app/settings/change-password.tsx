import React, { useState } from "react";

import { Check, Eye, EyeOff, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

import type { ApiError } from "@/services/api";
import { useChangePassword } from "@/hooks/useAuth";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

const ChangePasswordScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { mutate: changePassword, isPending } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState<
    string | null
  >(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(
    null,
  );
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const rules = [
    {
      key: "length",
      label: t("auth.password_rule_length"),
      met: newPassword.length >= 8,
    },
    {
      key: "uppercase",
      label: t("auth.password_rule_uppercase"),
      met: /[A-Z]/.test(newPassword),
    },
    {
      key: "lowercase",
      label: t("auth.password_rule_lowercase"),
      met: /[a-z]/.test(newPassword),
    },
    {
      key: "number",
      label: t("auth.password_rule_number"),
      met: /[0-9]/.test(newPassword),
    },
    {
      key: "special",
      label: t("auth.password_rule_special"),
      met: /[^A-Za-z0-9]/.test(newPassword),
    },
  ];

  const strengthScore = rules.filter((rule) => rule.met).length;
  const progressValue = (strengthScore / 5) * 100;

  let trackColorClassName = "bg-red-500";
  let strengthLabel = "";
  if (newPassword.length > 0) {
    if (strengthScore >= 5) {
      trackColorClassName = "bg-green-500";
      strengthLabel = t("auth.password_strength_strong");
    } else if (strengthScore >= 3) {
      trackColorClassName = "bg-yellow-500";
      strengthLabel = t("auth.password_strength_medium");
    } else {
      trackColorClassName = "bg-red-500";
      strengthLabel = t("auth.password_strength_weak");
    }
  }

  const handleSubmit = () => {
    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    const cleanedCurrent = currentPassword.trim();
    const cleanedNew = newPassword.trim();
    const cleanedConfirm = confirmPassword.trim();
    let hasError = false;

    if (!cleanedCurrent) {
      setCurrentPasswordError(t("auth.password_error_required"));
      hasError = true;
    }

    if (!cleanedNew) {
      setNewPasswordError(t("auth.password_error_required"));
      hasError = true;
    } else if (strengthScore < 5) {
      setNewPasswordError(t("auth.password_strength_error"));
      hasError = true;
    } else if (cleanedNew === cleanedCurrent) {
      setNewPasswordError(t("change_password.same_as_current_error"));
      hasError = true;
    }

    if (!cleanedConfirm) {
      setConfirmPasswordError(t("auth.password_error_required"));
      hasError = true;
    } else if (cleanedNew !== cleanedConfirm) {
      setConfirmPasswordError(t("auth.password_mismatch_error"));
      hasError = true;
    }

    if (hasError) return;

    changePassword(
      {
        currentPassword: cleanedCurrent,
        newPassword: cleanedNew,
        confirmPassword: cleanedConfirm,
      },
      {
        onSuccess: () => {
          toast.show({
            placement: "top",
            render: ({ id }) => (
              <Toast nativeID={`toast-${id}`} action="success" variant="solid">
                <ToastDescription>
                  {t("change_password.success")}
                </ToastDescription>
              </Toast>
            ),
          });
          router.back();
        },
        onError: (err: ApiError) => {
          setCurrentPasswordError(
            err?.response?.data?.message ||
              t("change_password.current_password_incorrect"),
          );
        },
      },
    );
  };

  return (
    <KeyboardAvoidingScrollView
      showBackButton
      alwaysShowBar
      title={t("change_password.title")}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <VStack space="lg" className="px-4 pt-6">
        <Text size="sm" className="text-muted-foreground">
          {t("change_password.subtitle")}
        </Text>

        {/* Current password */}
        <FormControl
          isInvalid={!!currentPasswordError}
          isDisabled={isPending}
          className="w-full"
        >
          <VStack space="xs">
            <FormControlLabel>
              <FormControlLabelText className="text-sm font-semibold">
                {t("change_password.current_password_label")}
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="w-full flex-row items-center">
              <InputField
                secureTextEntry={!showCurrentPassword}
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
                textContentType="password"
                placeholder={t("change_password.current_password_placeholder")}
                value={currentPassword}
                onChangeText={(val) => {
                  setCurrentPassword(val);
                  if (currentPasswordError) setCurrentPasswordError(null);
                }}
                className="flex-1 text-base text-foreground"
              />
              <InputSlot
                onPress={() => setShowCurrentPassword((prev) => !prev)}
                className="pr-3"
                accessibilityRole="button"
                accessibilityLabel={
                  showCurrentPassword
                    ? t("auth.hide_password")
                    : t("auth.show_password")
                }
              >
                <InputIcon
                  as={showCurrentPassword ? EyeOff : Eye}
                  className="w-5 h-5 text-muted-foreground"
                />
              </InputSlot>
            </Input>
            {currentPasswordError && (
              <FormControlError>
                <FormControlErrorText>
                  {currentPasswordError}
                </FormControlErrorText>
              </FormControlError>
            )}
          </VStack>
        </FormControl>

        {/* New password */}
        <FormControl
          isInvalid={!!newPasswordError}
          isDisabled={isPending}
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
                secureTextEntry={!showNewPassword}
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
                textContentType="newPassword"
                keyboardType="ascii-capable"
                placeholder={t("auth.new_password_placeholder")}
                value={newPassword}
                onChangeText={(val) => {
                  setNewPassword(val);
                  if (newPasswordError) setNewPasswordError(null);
                }}
                className="flex-1 text-base text-foreground"
              />
              <InputSlot
                onPress={() => setShowNewPassword((prev) => !prev)}
                className="pr-3"
                accessibilityRole="button"
                accessibilityLabel={
                  showNewPassword
                    ? t("auth.hide_password")
                    : t("auth.show_password")
                }
              >
                <InputIcon
                  as={showNewPassword ? EyeOff : Eye}
                  className="w-5 h-5 text-muted-foreground"
                />
              </InputSlot>
            </Input>

            {newPassword.length > 0 && (
              <VStack space="xs" className="mt-2">
                <HStack className="justify-between items-center">
                  <Text size="xs" className="text-muted-foreground">
                    {t("change_password.strength_label")}
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
                  <ProgressFilledTrack className={trackColorClassName} />
                </Progress>
              </VStack>
            )}

            <VStack space="xs" className="mt-3">
              {rules.map((rule) => {
                const hasInput = newPassword.length > 0;
                const icon = rule.met ? Check : X;
                return (
                  <HStack key={rule.key} space="xs" className="items-center">
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
                    <Text
                      size="xs"
                      className={
                        hasInput
                          ? rule.met
                            ? "text-green-500 font-medium"
                            : "text-red-500"
                          : "text-muted-foreground"
                      }
                    >
                      {rule.label}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>

            {newPasswordError && (
              <FormControlError className="mt-2">
                <FormControlErrorText>{newPasswordError}</FormControlErrorText>
              </FormControlError>
            )}
          </VStack>
        </FormControl>

        {/* Confirm new password */}
        <FormControl
          isInvalid={!!confirmPasswordError}
          isDisabled={isPending}
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
                accessibilityRole="button"
                accessibilityLabel={
                  showConfirmPassword
                    ? t("auth.hide_password")
                    : t("auth.show_password")
                }
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

        <Button
          variant="theme"
          size="xl"
          onPress={handleSubmit}
          disabled={isPending}
          className="gap-1 mt-2"
          accessibilityRole="button"
          accessibilityLabel={t("change_password.submit_button")}
        >
          <ButtonText>{t("change_password.submit_button")}</ButtonText>
          {isPending && <ButtonSpinner color="white" />}
        </Button>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default ChangePasswordScreen;
