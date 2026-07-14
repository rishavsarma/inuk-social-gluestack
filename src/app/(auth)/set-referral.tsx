import { useRouter } from "expo-router";
import { ArrowLeft, Gift, Sparkles, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";
import Logo from "@/components/custom/Logo";
import { useAppBottomInset } from "@/hooks/useAppInsets";
import { useValidateReferralCode } from "@/hooks/useAuth";
import { ROUTES } from "@/routes";
import { REFERRAL_REWARD_POINTS } from "@/constants";

const SetReferral = () => {
  const bottomInset = useAppBottomInset();
  const { t } = useTranslation();
  const router = useRouter();

  const [referralCode, setReferralCode] = useState("");
  const [debouncedReferralCode, setDebouncedReferralCode] = useState("");
  const [referralError, setReferralError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedReferralCode(referralCode.trim()),
      400,
    );
    return () => clearTimeout(timeout);
  }, [referralCode]);

  const { data: referralValidation, isFetching: isCheckingReferralCode } =
    useValidateReferralCode(debouncedReferralCode);

  const referrer =
    referralValidation?.status === "VALID" ? referralValidation.data : null;

  const isReferralMatched =
    debouncedReferralCode.length >= 6 &&
    debouncedReferralCode === referralCode.trim();

  const handleContinue = () => {
    const cleanedReferral = referralCode.trim();

    if (!cleanedReferral) {
      setReferralError(t("auth.referral_code_error_required"));
      return;
    }
    if (cleanedReferral.length < 6 || !referrer) {
      setReferralError(t("auth.referral_code_invalid"));
      return;
    }

    setReferralError(null);
    router.push({
      pathname: ROUTES.AUTH.SET_PROFILE,
      params: { referredBy: cleanedReferral },
    });
  };

  return (
    <KeyboardAvoidingScrollView>
      <VStack className="flex-1 justify-between bg-background relative">
        <VStack
          className="flex-1 items-center justify-center px-6 py-12"
          space="md"
        >
          <Logo size={40} />
        </VStack>

        <Card
          className="px-4 bg-card pt-8 shadow-none border-0 rounded-none rounded-t-4xl"
          style={{ paddingBottom: bottomInset + 20 }}
        >
          <VStack space="lg">
            <VStack>
              <Heading size="xl" className="font-bold text-foreground">
                {t("auth.set_referral_title")}
              </Heading>
              <Text size="sm" className="text-muted-foreground">
                {t("auth.set_referral_subtitle")}
              </Text>
            </VStack>

            {/* Referral Code Input */}
            <FormControl isInvalid={!!referralError} className="w-full">
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-semibold">
                    {t("auth.referral_code_label")}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputSlot>
                    <InputIcon as={Gift} className="text-muted-foreground" />
                  </InputSlot>
                  <InputField
                    autoCapitalize="characters"
                    placeholder={t("auth.referral_code_placeholder")}
                    value={referralCode}
                    onChangeText={(val) => {
                      setReferralCode(val);
                      if (referralError) setReferralError(null);
                    }}
                    className="text-base text-foreground"
                  />
                  <InputSlot className="pr-3">
                    {isCheckingReferralCode ? (
                      <Spinner size="small" />
                    ) : referrer ? (
                      <InputIcon
                        as={ChevronRightIcon}
                        className="text-green-600"
                      />
                    ) : null}
                  </InputSlot>
                </Input>

                {isReferralMatched && referrer && (
                  <Card className="p-3 mt-1 bg-card rounded-md">
                    <HStack space="md" className="items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarFallbackText>
                          {referrer.givenName ?? referrer.username}
                        </AvatarFallbackText>
                        {referrer.avatar ? (
                          <AvatarImage
                            source={{
                              uri: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${referrer.avatar}/jpeg/150`,
                            }}
                          />
                        ) : null}
                      </Avatar>
                      <VStack className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">
                          {referrer.givenName}
                        </Text>
                        {referrer.username ? (
                          <Text className="text-xs text-muted-foreground">
                            @{referrer.username}
                          </Text>
                        ) : null}
                      </VStack>
                    </HStack>

                    <Divider className="my-3 bg-amber-500/20" />

                    <HStack className="items-stretch justify-between">
                      <VStack space="xs" className="flex-1 items-center">
                        <Box className="h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 dark:bg-amber-500/25">
                          <Icon
                            as={Sparkles}
                            size="md"
                            className="text-amber-500"
                          />
                        </Box>
                        <Text className="text-sm font-bold text-foreground">
                          {t("auth.referral_reward_sparks", {
                            count: REFERRAL_REWARD_POINTS.REFERRER,
                          })}
                        </Text>
                        <Text className="text-xs text-muted-foreground text-center">
                          {t("auth.referral_reward_you_earn")}
                        </Text>
                      </VStack>

                      <Divider
                        orientation="vertical"
                        className="mx-3 bg-amber-500/20"
                      />

                      <VStack space="xs" className="flex-1 items-center">
                        <Box className="h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 dark:bg-amber-500/25">
                          <Icon as={Users} size="md" className="text-amber-500" />
                        </Box>
                        <Text className="text-sm font-bold text-foreground">
                          {t("auth.referral_reward_sparks", {
                            count: REFERRAL_REWARD_POINTS.REFEREE,
                          })}
                        </Text>
                        <Text className="text-xs text-muted-foreground text-center">
                          {t("auth.referral_reward_friend_earns")}
                        </Text>
                      </VStack>
                    </HStack>
                  </Card>
                )}
                {isReferralMatched && !referrer && referralValidation && (
                  <Text className="text-xs text-destructive">
                    {referralValidation.message ??
                      t("auth.referral_code_invalid")}
                  </Text>
                )}
                {referralError && (
                  <FormControlError>
                    <FormControlErrorText>
                      {referralError}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </VStack>
            </FormControl>

            <Button
              size="xl"
              variant="theme"
              onPress={handleContinue}
              disabled={isCheckingReferralCode}
              className="gap-1"
              accessibilityRole="button"
              accessibilityLabel={t("auth.referral_continue_button")}
            >
              <ButtonText>{t("auth.referral_continue_button")}</ButtonText>
              {isCheckingReferralCode ? (
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
                accessibilityRole="button"
                accessibilityLabel={t("auth.back_to_login")}
              >
                <ButtonIcon as={ArrowLeft} />
                <ButtonText>{t("auth.back_to_login")}</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
};

export default SetReferral;
