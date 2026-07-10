import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export const useInitiateJourney = () => {
  return useMutation({
    mutationFn: (payload: { contact: string; accountType: AccountType }) =>
      authService.initiateJourney(payload),
  });
};

export const useSignInInitiateOtp = () => {
  return useMutation({
    mutationFn: (payload: { contact: string; profileType: AccountType }) =>
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
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authService.changePassword(payload),
  });
};
