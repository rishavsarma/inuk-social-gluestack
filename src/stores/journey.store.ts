import { create } from 'zustand';

interface JourneyState {
  otpId: string | null;
  phone: string;
  country: { dial: string };
  tempToken: string | null;
  tempProfileId: string | null;
  tempAccountId: string | null;
  setOtpId: (otpId: string) => void;
  setPhone: (phone: string) => void;
  setCountry: (country: { dial: string }) => void;
  setTempData: (data: { token: string; profileId: string; accountId: string }) => void;
  setResetTemp: () => void;
  reset: () => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  otpId: null,
  phone: '',
  country: { dial: '' },
  tempToken: null,
  tempProfileId: null,
  tempAccountId: null,
  setOtpId: (otpId) => set({ otpId }),
  setPhone: (phone) => set({ phone }),
  setCountry: (country) => set({ country }),
  setTempData: (data) =>
    set({
      tempToken: data.token,
      tempProfileId: data.profileId,
      tempAccountId: data.accountId,
    }),
  setResetTemp: () => set({ tempToken: null, tempProfileId: null, tempAccountId: null }),
  reset: () =>
    set({
      otpId: null,
      phone: '',
      country: { dial: '' },
      tempToken: null,
      tempProfileId: null,
      tempAccountId: null,
    }),
}));
