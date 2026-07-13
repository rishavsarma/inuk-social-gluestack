import { authService } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useInitiateJourney = () => {
  return useMutation<
    InitiateJourneyResponse,
    AxiosError<{ message?: string }>,
    { contact: string; accountType: AccountType }
  >({
    mutationFn: (payload) => authService.initiateJourney(payload),
  });
};

export const useSignInInitiateOtp = () => {
  return useMutation({
    mutationFn: (payload: { contact: string; profileType: AccountType }) =>
      // console.log('payload', payload)
      authService.signInInitiateOtp(payload), //TODO There should be only one api to send otp and another api to verify it. Also requestId is needed for validation
  });
};

export const useSignInVerifyOtp = () => {
  return useMutation({
    mutationFn: (payload: {
      contact: string;
      requestId?: string;
      otp: string;
      profileType: AccountType;
    }) => authService.signInVerifyOtp(payload),
  });
};

export const useSignUpVerifyOtp = () => {
  return useMutation({
    mutationFn: (payload: {
      contact: string;
      requestId: string;
      otp: string;
      profileType: AccountType;
    }) => authService.signUpVerifyOtp(payload),
  });
};

export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: (payload: {
      contact: string;
      password: string;
      profileType: AccountType; //TODO /initiate-journey its accountType but here its profile type
    }) => authService.signInVerifyPassword(payload),
  });
};

export const useSignUpSetPassword = () => {
  return useMutation({
    mutationFn: (payload: SetPasswordPayload) =>
      authService.signUpSetPassword(payload),
  });
};
export const useResetPasswordUpdate = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordUpdatePayload) =>
      authService.resetPasswordUpdate(payload),
  });
};

export const useChangePassword = () => {
  return useMutation<
    ChangePasswordResponse,
    AxiosError<{ message?: string }>,
    ChangePasswordPayload
  >({
    mutationFn: (payload) => authService.changePassword(payload),
  });
};

export const useSetProfileDetails = () => {
  return useMutation({
    mutationFn: (payload: SetProfilePayload) =>
      authService.signUpSetProfile(payload),
  });
};

const USERNAME_REGEX = /^[a-z0-9_]{3,}$/;

export const useValidateUsername = (username: string) => {
  const trimmed = username.trim().toLowerCase();

  return useQuery({
    queryKey: ["validate-username", trimmed],
    queryFn: () => authService.validateUsername(trimmed),
    enabled: USERNAME_REGEX.test(trimmed),
    staleTime: 30_000,
  });
};

export const useValidateReferralCode = (code: string) => {
  const trimmed = code.trim();

  return useQuery({
    queryKey: ["validate-referral-code", trimmed],
    queryFn: () => authService.validateReferralCode(trimmed),
    enabled: trimmed.length >= 6,
    staleTime: 30_000,
  });
};
