import { api } from "./api";

export const authService = {
  initiateJourney: async (payload: InitiateJourneyPayload) => {
    const { data } = await api.post<InitiateJourneyResponse>(
      "/auth/initiate-journey",
      payload,
    );
    return data;
  },

  signInInitiateOtp: async (payload: SignInOtpInitiatePayload) => {
    const { data } = await api.post<SignInOtpInitiateResponse>(
      "/auth/sign-in/otp/initiate",
      payload,
    );
    return data;
  },

  signInVerifyOtp: async (payload: VerifyOtpPayload) => {
    const { data } = await api.post<SignInVerifyOtpResponse>(
      "/auth/sign-in/otp",
      payload,
    );
    return data;
  },

  signInVerifyPassword: async (payload: SignInWithPasswordPayload) => {
    const { data } = await api.post<SignInWithPasswordResponse>(
      "/auth/sign-in",
      payload,
    );
    return data;
  },

  signUpVerifyOtp: async (payload: VerifyOtpPayload) => {
    const { data } = await api.post<VerifyOtpResponse>(
      "/auth/sign-up/verify-otp",
      payload,
    );
    return data;
  },

  signUpSetPassword: async (payload: SetPasswordPayload) => {
    const { data } = await api.post<SetPasswordResponse>(
      "/iam/sign-up/set-password",
      payload,
    );
    return data;
  },

  signUpSetProfile: async (payload: any) => {
    const { data } = await api.put<SetProfileResponse>(
      "/iam/sign-up/set-profile",
      payload,
    );
    return data;
  },

  resetPasswordInitiate: async (payload: ResetPasswordInitiatePayload) => {
    const { data } = await api.post<ResetPasswordInitiateResponse>(
      "/auth/reset-password/initiate",
      payload,
    );
    return data;
  },

  resetPasswordVerifyOtp: async (payload: ResetPasswordVerifyOtpPayload) => {
    const { data } = await api.post<ResetPasswordVerifyOtpResponse>(
      "/auth/reset-password/verify-otp",
      payload,
    );
    return data;
  },

  resetPasswordUpdate: async (payload: ResetPasswordUpdatePayload) => {
    const { data } = await api.post<ResetPasswordUpdateResponse>(
      "/auth/reset-password/update",
      payload,
    );
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const { data } = await api.post<ChangePasswordResponse>(
      "/iam/change-password",
      payload,
    );
    return data;
  },

  validateUsername: async (username: string) => {
    const { data } = await api.get<ValidateUsernameResponse>(
      `/auth/validate/username/${encodeURIComponent(username)}`,
    );
    return data;
  },

  validateReferralCode: async (code: string) => {
    const { data } = await api.get<ValidateReferralCodeResponse>(
      `/auth/validate/referral-code/${encodeURIComponent(code)}`,
    );
    return data;
  },
};
