import { Platform } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

const EXTRA_INSETS = {
  android: {
    top: 10,
    bottom: 20,
    left: 0,
    right: 0,
  },
  ios: {
    top: 0,
    bottom: 10,
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

export function useAppTopInset(): number {
  return useAppInsets().top;
}
export function useAppBottomInset(): number {
  return useAppInsets().bottom;
}
export function useAppLeftInset(): number {
  return useAppInsets().left;
}
export function useAppRightInset(): number {
  return useAppInsets().right;
}
