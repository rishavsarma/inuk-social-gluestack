import { Platform } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

const EXTRA_INSETS = {
  android: {
    top: 10,
    bottom: 30,
    left: 0,
    right: 0,
  },
  ios: {
    top: 4,
    bottom: 0,
    left: 0,
    right: 0,
  },
};

export function useAppInsets(): EdgeInsets {
  const insets = useSafeAreaInsets();
  const extra =
    Platform.OS === "android" ? EXTRA_INSETS.android : EXTRA_INSETS.ios;

  if (Platform.OS === "android") {
    return {
      top: insets.top + extra.top,
      bottom: insets.bottom + extra.bottom,
      left: insets.left + extra.left,
      right: insets.right + extra.right,
    };
  } else {
    return {
      top: insets.top + extra.top,
      bottom: insets.bottom + extra.bottom,
      left: insets.left + extra.left,
      right: insets.right + extra.right,
    };
  }
}

export const useAppTopInset = (): number => useAppInsets().top;
export const useAppBottomInset = (): number => useAppInsets().bottom;
export const useAppLeftInset = (): number => useAppInsets().left;
export const useAppRightInset = (): number => useAppInsets().right;
